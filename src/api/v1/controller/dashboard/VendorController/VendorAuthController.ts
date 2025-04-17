import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../middleware/errorHanding";
import { EmailPasswordSchema, RefreshTokenSchema, VerifyOtpSchema } from "../../../validations/app";
import { VendorAuthService } from "../../../service/dashboard";
import { sendResponse } from "../../../utils/sendResponse";
import { ChangePasswordSchema, ForgotPasswordSchema, ResetPasswordSchema, VendorRegisterSchema } from "../../../validations/dashboard/Vendor/vendorAuth.schema";


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
    const { refresh_token } = RefreshTokenSchema.parse(req.body);
    const response = await VendorAuthService.handleRefreshTokenVendor(refresh_token);
    sendResponse(res, response.status, response.success, response.message, response.data);
  } catch (error) {
    next(error);
  }
};


export const forgotPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = ForgotPasswordSchema.parse(req.body);
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