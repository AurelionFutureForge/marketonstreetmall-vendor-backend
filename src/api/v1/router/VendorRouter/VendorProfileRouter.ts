import express, { Router } from 'express';
import { VendorProfileController } from '../../controller';
import { checkVendorlRole, verifyVendorToken } from '../../middleware/roleBasedAuth';
const VendorProfileRouter: Router = express.Router();

VendorProfileRouter.get('/',verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorProfileController.getProfile);
VendorProfileRouter.put('/',verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorProfileController.updateVendorProfile);
VendorProfileRouter.post('/documents',verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorProfileController.uploadVendorDocuments);
VendorProfileRouter.get('/documents',verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorProfileController.getVendorDocuments); 
VendorProfileRouter.get('/vendor-user-profile',verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorProfileController.getVendorProfile);

export default VendorProfileRouter;  