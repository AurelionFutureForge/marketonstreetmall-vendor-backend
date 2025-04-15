import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../middleware/errorHanding";
import { MobileNumberSchema, OtpSchema, RefreshTokenSchema, RegisterInputSchema, ResendOtpSchema, VerifyUserIdSchema } from "../../../validations/app";
import { AuthService } from "../../../service/dashboard";
import { sendResponse } from "../../../utils/sendResponse";
import { z } from "zod";


const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  mobile_number: z.string().min(10).max(10),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'PRODUCT_ADMIN'])
});

export const VerifyOtpSchema = z.object({
  otp_id: z.string(),
  otp: z.string().length(6, "OTP must be exactly 6 digits long").regex(/^[0-9]+$/, "OTP must only contain digits"),
});

const ResetPasswordSchema = z.object({
  token: z.string(),
  new_password: z.string().min(6)
});

const ChangePasswordSchema = z.object({
  current_password: z.string().min(6),
  new_password: z.string().min(6)
});

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        vendor_id?: string;
        cms_user_id?: string;
        role: string;
      };
    }
  }
}

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mobile_number } = MobileNumberSchema.parse(req.body);
    const response = await AuthService.handleLogin(mobile_number);
    sendResponse(res, response.status, true, response.message, response.data);
  } catch (error) {
    next(error)
  }
};

export const verifyOtpController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { otp_id, otp } = VerifyOtpSchema.parse(req.body);
    const response = await AuthService.verifyOtp(otp_id, otp);
    if (response.success) {
      sendResponse(res, response.status, true, response.message, response.data);
    } else {
      sendResponse(res, response.status, false, response.message);
    }
  } catch (error) {
    next(error)
  }
};


export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = RegisterSchema.parse(req.body);
    const response = await AuthService.handleRegister(userData);
    sendResponse(res, response.status, response.success, response.message, response.data);
  } catch (error) {
    next(error);
  }
};

export const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      throw new AppError("Refresh token is required", 400);
    }
    const response = await AuthService.handleRefreshToken(refresh_token);
    sendResponse(res, response.status, response.success, response.message, response.data);
  } catch (error) {
    next(error);
  }
};


export const forgotPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new AppError("Email is required", 400);
    }
    const response = await AuthService.handleForgotPassword(email);
    sendResponse(res, response.status, response.success, response.message, response.data);
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, new_password } = ResetPasswordSchema.parse(req.body);
    const response = await AuthService.handleResetPassword(token, new_password);
    sendResponse(res, response.status, response.success, response.message);
  } catch (error) {
    next(error);
  }
};

export const changePasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { current_password, new_password } = ChangePasswordSchema.parse(req.body);
    const cmsUserId = req.user?.cms_user_id;
    if (!cmsUserId) {
      throw new AppError("User not authenticated", 401);
    }
    const response = await AuthService.handleChangePassword(cmsUserId, current_password, new_password);
    sendResponse(res, response.status, response.success, response.message);
  } catch (error) {
    next(error);
  }
};

// export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       throw new AppError("No token provided", 401);
//     }
//     const response = await AuthService.handleLogout(token);
//     sendResponse(res, response.status, response.success, response.message);
//   } catch (error) {
//     next(error);
//   }
// };