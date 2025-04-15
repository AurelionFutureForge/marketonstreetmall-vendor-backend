import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../middleware/errorHanding";
import { EmailPasswordSchema } from "../../../validations/app";
import { VendorAuthService } from "../../../service/dashboard";
import { sendResponse } from "../../../utils/sendResponse";
import { z } from "zod";


export const VendorRegisterSchema = z.object({
  business_name: z.string().min(1, 'Business name is required'),
  legal_name: z.string().min(1, 'Legal name is required'),
  gstin: z.string().optional(), // Optional but should be valid if present
  pan: z.string().optional(),
  commission_rate: z.number().default(0), // optional, defaulted to 0
  onboarding_completed: z.boolean().default(false), // optional
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone must be 10 digits').max(10, 'Phone must be 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['VENDOR_ADMIN', 'PRODUCT_ADMIN']).default('VENDOR_ADMIN'),
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
        cms_user_id?: string;
        vendor_id?: string;
        role: string;
      };
    }
  }
}

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = EmailPasswordSchema.parse(req.body);
    const response = await VendorAuthService.handleLoginVendor(email, password);
    sendResponse(res, response.status, true, response.message, response.data);
  } catch (error) {
    next(error);
  }
};


export const verifyOtpController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { otp_id, otp } = VerifyOtpSchema.parse(req.body);
    const response = await VendorAuthService.verifyOtp(otp_id, otp);
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
    const vendorData = VendorRegisterSchema.parse(req.body);
    const response = await VendorAuthService.handleVendorRegister(vendorData);
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
    const response = await VendorAuthService.handleRefreshTokenVendor(refresh_token);
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
    const response = await VendorAuthService.handleForgotPasswordVendor(email);
    sendResponse(res, response.status, response.success, response.message, response.data);
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, new_password } = ResetPasswordSchema.parse(req.body);
    const response = await VendorAuthService.handleResetPasswordVendor(token, new_password);
    sendResponse(res, response.status, response.success, response.message);
  } catch (error) {
    next(error);
  }
};

export const changePasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { current_password, new_password } = ChangePasswordSchema.parse(req.body);
    const vendor_id = req.user?.vendor_id;
    if (!vendor_id) {
      throw new AppError("User not authenticated", 401);
    }
    const response = await VendorAuthService.handleChangePasswordVendor(vendor_id, current_password, new_password);
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
//     const response = await VendorAuthService.handleLogout(token);
//     sendResponse(res, response.status, response.success, response.message);
//   } catch (error) {
//     next(error);
//   }
// };