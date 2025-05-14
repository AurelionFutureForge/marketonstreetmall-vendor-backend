import express, { Router } from 'express';
import { VendorAuthController } from '../../controller';
import { checkVendorRole, verifyVendorToken } from '../../middleware/roleBasedAuth';
const VendorAuthRouter: Router = express.Router();

VendorAuthRouter.post('/register', VendorAuthController.registerController);
VendorAuthRouter.post('/login', VendorAuthController.loginController);
VendorAuthRouter.post('/refresh-token', VendorAuthController.refreshTokenController);
VendorAuthRouter.post('/forgot-password', VendorAuthController.forgotPasswordController);
VendorAuthRouter.post('/reset-password', VendorAuthController.resetPasswordController);
VendorAuthRouter.post('/change-password', verifyVendorToken, checkVendorRole(["VENDOR_ADMIN", "PRODUCT_ADMIN"]), VendorAuthController.changePasswordController);

export default VendorAuthRouter;