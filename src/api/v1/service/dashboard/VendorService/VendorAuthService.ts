import prisma from '../../../../../../prisma/client/prismaClient';
import { sendToken } from '../../../utils/sendToken';
import { sendMail } from '../../../utils/smtpService';
import jwt from 'jsonwebtoken';

export const getCmsUserByEmailVendor = async (email: string) => {
  return await prisma.vendor.findUnique({
    where: { email }
  });
};


export const handleVendorRegister = async (vendorData: {
  name: string;
  business_name: string;
  legal_name: string;
  gstin?: string;
  pan?: string;
  commission_rate?: number;
  onboarding_completed?: boolean;
  email: string;
  phone: string;
  password: string;
  role?: 'VENDOR_ADMIN' | 'PRODUCT_ADMIN';
}) => {
  try {
    const existingVendor = await prisma.vendor.findFirst({
      where: {
        OR: [
          { email: vendorData.email },
          { phone: vendorData.phone },
          vendorData.gstin ? { gstin: vendorData.gstin } : undefined,
          vendorData.pan ? { pan: vendorData.pan } : undefined,
        ].filter(Boolean) as any, // Remove undefined entries
      },
    });

    if (existingVendor) {
      return { status: 400, success: false, message: 'Vendor already exists with given email, phone, GSTIN, or PAN' };
    }

    const newVendor = await prisma.vendor.create({
      data: {
        name: vendorData.name,
        business_name: vendorData.business_name,
        legal_name: vendorData.legal_name,
        gstin: vendorData.gstin,
        pan: vendorData.pan,
        commission_rate: vendorData.commission_rate ?? 0,
        onboarding_completed: vendorData.onboarding_completed ?? false,
        email: vendorData.email,
        phone: vendorData.phone,
        password: vendorData.password,
        role: vendorData.role ?? 'VENDOR_ADMIN',
      }
    });

    return {
      status: 201,
      success: true,
      message: 'Vendor registered successfully',
      data: {
        vendor_id: newVendor.vendor_id,
        name: newVendor.name,
        business_name: newVendor.business_name,
        email: newVendor.email,
        phone: newVendor.phone,
        role: newVendor.role,
      },
    };
  } catch (error) {
    throw error;
  }
};


export const handleLoginVendor = async (email: string, password: string) => {
  try {
    const user = await getCmsUserByEmailVendor(email);

    if (!user) {
      return { status: 404, message: 'User not found' };
    }

    // Verify password
    if (user.password !== password) {
      return { status: 401, message: 'Invalid credentials' };
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { vendor_id: user.vendor_id, role: user.role },
      process.env.JWT_SECRET || 'access-secret',
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { vendor_id: user.vendor_id },
      process.env.RESET_TOKEN_SECRET || 'refresh-secret',
      { expiresIn: '7d' }
    );

    return {
      status: 200,
      message: 'Login successful',
      data: {
        user: {
          vendor_id: user.vendor_id,
          name: user.legal_name,
          email: user.email,
          role: user.role
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
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

export const handleForgotPasswordVendor = async (email: string,origin: string) => {
  try {
    const user = await getCmsUserByEmailVendor(email);
    if (!user) {
      return { status: 201, success: false, message: 'User not found' };
    }

    const resetToken = jwt.sign(
      { vendor_id: user.vendor_id },
      process.env.RESET_TOKEN_SECRET || 'reset-secret',
      { expiresIn: '15m' }
    );

    // Store reset token in database
    await prisma.passwordReset.create({
      data: {
        user_id: user.vendor_id,
        token: resetToken,
        expires_at: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      }
    });

    const resetLink = `${origin}/reset-password/${resetToken}`;
    await sendMail(
      user.email,
      'Reset your password',
      `Click the following link to reset your password: ${resetLink}`
    );

    return {
      status: 200,
      success: true,
      message: 'Password reset link sent successfully'
    };
  } catch (error) {
    throw error;
  }
};

export const handleResetPasswordVendor = async (token: string, newPassword: string) => {
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET || 'reset-secret') as { vendor_id: string };
    
    // Check if token exists and is not expired
    const resetToken = await prisma.passwordReset.findFirst({
      where: {
        token: token,
        user_id: decoded.vendor_id,
        expires_at: { gt: new Date() }
      }
    });

    if (!resetToken) {
      return { status: 400, success: false, message: 'Invalid or expired reset token' };
    }

    // Update password
    await prisma.vendor.update({
      where: { vendor_id: decoded.vendor_id },
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

export const handleChangePasswordVendor = async (vendor_id: string, currentPassword: string, newPassword: string) => {
  try {
    const user = await prisma.vendor.findUnique({
      where: { vendor_id: vendor_id }
    });

    if (!user) {
      return { status: 404, success: false, message: 'User not found',data :vendor_id };
    }

    // Verify current password
    if (user.password !== currentPassword) {
      return { status: 400, success: false, message: 'Current password is incorrect' };
    }

    // Update password
    await prisma.vendor.update({
      where: { vendor_id: vendor_id },
      data: { password: newPassword }
    });

    return { status: 200, success: true, message: 'Password changed successfully' };
  } catch (error) {
    throw error;
  }
};


export const handleRefreshTokenVendor = async (refreshToken: string) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.RESET_TOKEN_SECRET || 'refresh-secret') as { vendor_id: string };

    const blacklisted = await prisma.tokenBlacklist.findUnique({
      where: { token: refreshToken }
    });

    if (blacklisted) {
      return { status: 401, success: false, message: 'Token has been revoked' };
    }

    // Get user
    const user = await prisma.vendor.findUnique({
      where: { vendor_id: decoded.vendor_id }
    });

    if (!user) {
      return { status: 404, success: false, message: 'User not found' };
    }
    // Generate new access token
    const accessToken = jwt.sign(
      { vendor_id: user.vendor_id, role: user.role },
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

