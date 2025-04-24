import express, { Router } from 'express';
import { VendorController } from '../../../controller/dashboard';
import { checkVendorlRole, verifyVendorToken } from '../../../middleware/roleBasedAuth';
const VendorRouter: Router = express.Router();

// Authentication endpoints
// VendorRouter.post('/register', VendorController.registerController);
// VendorRouter.post('/login', VendorController.loginController);
VendorRouter.get('/profile',verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorController.getProfile);
VendorRouter.put('/profile',verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorController.updateVendorProfile);
VendorRouter.post('/documents',verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorController.uploadVendorDocuments);
VendorRouter.get('/documents',verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorController.getVendorDocuments); 
VendorRouter.get('/vendor-user-profile',verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorController.getVendorProfile);

export default VendorRouter;