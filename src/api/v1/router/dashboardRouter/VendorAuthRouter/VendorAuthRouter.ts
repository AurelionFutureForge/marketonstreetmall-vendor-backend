import express, { Router } from 'express';
import { VendorAuthController } from '../../../controller/dashboard';
import { checkVendorlRole, verifyVendorToken } from '../../../middleware/roleBasedAuth';
const VendorAuthRouter: Router = express.Router();

// Authentication endpoints
VendorAuthRouter.post('/register', VendorAuthController.registerController);
VendorAuthRouter.post('/login', VendorAuthController.loginController);
VendorAuthRouter.post('/refresh-token', VendorAuthController.refreshTokenController);
VendorAuthRouter.post('/forgot-password', VendorAuthController.forgotPasswordController);
VendorAuthRouter.post('/reset-password', VendorAuthController.resetPasswordController);
VendorAuthRouter.post('/change-password',verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorAuthController.changePasswordController);

export default VendorAuthRouter;