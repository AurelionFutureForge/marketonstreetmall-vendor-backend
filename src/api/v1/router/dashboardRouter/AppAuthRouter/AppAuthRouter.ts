import express, { Router } from 'express';
import { AuthController } from '../../../controller/dashboard';
import { checkCMSRole, verifyCMSToken } from '../../../middleware/roleBasedAuth';
const AppAuthRouter: Router = express.Router();

// Authentication endpoints
AppAuthRouter.post('/register', AuthController.registerController);
AppAuthRouter.post('/login', AuthController.loginController);
AppAuthRouter.post('/verify-otp', AuthController.verifyOtpController);
AppAuthRouter.post('/refresh-token', AuthController.refreshTokenController);
AppAuthRouter.post('/forgot-password', AuthController.forgotPasswordController);
AppAuthRouter.post('/reset-password', AuthController.resetPasswordController);
AppAuthRouter.post('/change-password',verifyCMSToken, checkCMSRole(["SUPER_ADMIN"]), AuthController.changePasswordController);

export default AppAuthRouter;