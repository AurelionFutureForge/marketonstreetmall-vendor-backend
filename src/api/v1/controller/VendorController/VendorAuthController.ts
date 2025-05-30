import { NextFunction, Request, Response } from "express";
import { EmailPasswordSchema, RefreshTokenSchema, VerifyOtpSchema, AuthenticatedUserSchema, ChangePasswordSchema, ForgotPasswordSchema, ResetPasswordSchema, VendorRegisterSchema } from "../../validations";
import { VendorAuthService } from "../../service";
import { sendResponse } from "../../utils";

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
    const { email, origin } = ForgotPasswordSchema.parse(req.body);
    const response = await VendorAuthService.handleForgotPasswordVendor(email, origin);
    sendResponse(res, response.status, response.success, response.message);
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
    const { vendor_user_id } = AuthenticatedUserSchema.parse(req.user);
    const response = await VendorAuthService.handleChangePasswordVendor(vendor_user_id!, current_password, new_password);
    sendResponse(res, response.status, response.success, response.message);
  } catch (error) {
    next(error);
  }
};