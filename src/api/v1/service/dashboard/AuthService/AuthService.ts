import prisma from '../../../../../../prisma/client/prismaClient';
import { sendOtp } from '../../../utils/fast2Sms';
import { generateOtp } from '../../../utils/generateOtp';
import { sendToken } from '../../../utils/sendToken';
import { sendMail } from '../../../utils/smtpService';
import jwt from 'jsonwebtoken';

export const getUserByMobileNumber = async (mobileNumber: string) => {
  return await prisma.cmsUser.findUnique({
    where: { mobile_number: mobileNumber }
  });
};

export const storeOtp = async (userId: string | null, otp: string, user_phone_number: string) => {
  try {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const data: any = {
      otp: otp,
      otp_expiration: expiresAt,
      mobile_number: user_phone_number
    };

    if (userId !== null) {
      data.user_id = userId;
    }
    console.log("data", data);
    
    return await prisma.otp.create({
      data: data,
    });
    console.log("otp", otp);
  } catch (error) {
    console.error("Error storing OTP:", error);
    throw error
  }
};

export const getCmsUserByEmail = async (email: string) => {
  return await prisma.cmsUser.findUnique({
    where: { email }
  });
};


export const handleRegister = async (userData: {
  name: string;
  email: string;
  password: string;
  mobile_number: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'PRODUCT_ADMIN';
}) => {
  try {
    // Check if user already exists
    const existingUser = await getCmsUserByEmail(userData.email);
    if (existingUser) {
      return { status: 400, success: false, message: 'Email already registered' };
    }

    // Create new user
    const newUser = await prisma.cmsUser.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        mobile_number: userData.mobile_number,
        role: userData.role
      }
    });

    return {
      status: 201,
      success: true,
      message: 'User registered successfully',
      data: {
        cms_user_id: newUser.cms_user_id,
        name: newUser.name,
        email: newUser.email,
        mobile_number: newUser.mobile_number,
        role: newUser.role
      }
    };
  } catch (error) {
    throw error;
  }
};

export const handleLogin = async (mobileNumber: string) => {
  try {
    const user = await getUserByMobileNumber(mobileNumber);
    
    if (!user) {
      return { status: 404, message: 'User not found' };
    }

    // ✅ Fixed OTP for test number 9150073272 enabled for Google reviewers or whitelisted test numbers.
    const otp = mobileNumber === "9150073272" ? "654321" : generateOtp();

    const { otp_id } = await storeOtp(user.cms_user_id, otp, user.mobile_number);
    
    await sendOtp(mobileNumber, otp);

    return { 
      status: 200, 
      message: 'OTP sent successfully', 
      data: { mobile_number: user.mobile_number, otp_id: otp_id } 
    };
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (otp_id: string, otp: string) => {
  try {
    // Fetch the OTP from the database
    const storedOtp = await prisma.otp.findUnique({
      where: { otp_id: otp_id },
      include: {
        relatedCmsUser: true
      }
    });
    console.log(storedOtp)
    if (!storedOtp) {
      return { status: 400, success: false, message: 'OTP not found' };
    }

    if (storedOtp.otp !== otp) {
      return { status: 400, success: false, message: 'Invalid OTP' };
    }

    if (new Date() > storedOtp.otp_expiration!) {
      return { status: 400, success: false, message: 'OTP expired' };
    }

    if (!storedOtp.relatedCmsUser) {
      return { status: 404, success: false, message: 'User not found' };
    }

    const tokenData = await sendToken(storedOtp.relatedCmsUser);
    await prisma.otp.delete({
      where: {
        otp_id: otp_id
      }
    })
    return { status: 200, success: true, message: 'OTP verified successfully', data: { ...storedOtp.relatedCmsUser, tokenData } };
  } catch (error) {
    throw error
  }
};

export const handleForgotPassword = async (email: string) => {
  try {
    const user = await getCmsUserByEmail(email);
    if (!user) {
      return { status: 404, success: false, message: 'User not found' };
    }

    const resetToken = jwt.sign(
      { cms_user_id: user.cms_user_id },
      process.env.RESET_TOKEN_SECRET || 'reset-secret',
      { expiresIn: '15m' }
    );

    // Store reset token in database
    await prisma.passwordReset.create({
      data: {
        user_id: user.cms_user_id,
        token: resetToken,
        expires_at: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      }
    });

    const resetLink = `http://localhost:3000/forget-password?token=${resetToken}`;
    await sendMail(
      user.email,
      'Reset your password',
      `Click the following link to reset your password: ${resetLink}`
    );

    return {
      status: 200,
      success: true,
      message: 'Password reset link sent successfully',
      data: { reset_token: resetToken }
    };
  } catch (error) {
    throw error;
  }
};

export const handleResetPassword = async (token: string, newPassword: string) => {
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET || 'reset-secret') as { cms_user_id: string };
    
    // Check if token exists and is not expired
    const resetToken = await prisma.passwordReset.findFirst({
      where: {
        token: token,
        user_id: decoded.cms_user_id,
        expires_at: { gt: new Date() }
      }
    });

    if (!resetToken) {
      return { status: 400, success: false, message: 'Invalid or expired reset token' };
    }

    // Update password
    await prisma.cmsUser.update({
      where: { cms_user_id: decoded.cms_user_id },
      data: { password: newPassword }
    });

    // Delete used token
    await prisma.passwordReset.delete({
      where: { id: resetToken.id }
    });

    return { status: 200, success: true, message: 'Password reset successfully' };
  } catch (error) {
    throw error;
  }
};

export const handleChangePassword = async (cmsUserId: string, currentPassword: string, newPassword: string) => {
  try {
    const user = await prisma.cmsUser.findUnique({
      where: { cms_user_id: cmsUserId }
    });

    if (!user) {
      return { status: 404, success: false, message: 'User not found',data :cmsUserId };
    }

    // Verify current password
    if (user.password !== currentPassword) {
      return { status: 400, success: false, message: 'Current password is incorrect' };
    }

    // Update password
    await prisma.cmsUser.update({
      where: { cms_user_id: cmsUserId },
      data: { password: newPassword }
    });

    return { status: 200, success: true, message: 'Password changed successfully' };
  } catch (error) {
    throw error;
  }
};

export const handleRefreshToken = async (refreshToken: string) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.RESET_TOKEN_SECRET || 'refresh-secret') as { cms_user_id: string };

    const blacklisted = await prisma.tokenBlacklist.findUnique({
      where: { token: refreshToken }
    });

    if (blacklisted) {
      return { status: 401, success: false, message: 'Token has been revoked' };
    }

    // Get user
    const user = await prisma.cmsUser.findUnique({
      where: { cms_user_id: decoded.cms_user_id }
    });

    if (!user) {
      return { status: 404, success: false, message: 'User not found' };
    }
    // Generate new access token
    const accessToken = jwt.sign(
      { cms_user_id: user.cms_user_id, role: user.role },
      process.env.JWT_SECRET || 'access-secret',
      { expiresIn: '15m' }
    );

    return { 
      status: 200, 
      success: true,
      message: 'Token refreshed successfully',
      data: { accessToken }
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};


// export const handleLogout = async (token: string) => {
//   try {
//     // Add token to blacklist
//     await prisma.tokenBlacklist.create({
//       data: {
//         token: token,
//         expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
//       }
//     });

//     return { status: 200, success: true, message: 'Logged out successfully' };
//   } catch (error) {
//     throw error;
//   }
// };