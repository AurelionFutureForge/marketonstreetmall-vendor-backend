import express, { Router } from 'express';
import { VendorProfileController } from '../../controller';
import { checkVendorRole, verifyVendorToken } from '../../middleware/roleBasedAuth';
const VendorProfileRouter: Router = express.Router();

VendorProfileRouter.get('/',verifyVendorToken, checkVendorRole(["VENDOR_ADMIN"]), VendorProfileController.getProfile);
VendorProfileRouter.put('/',verifyVendorToken, checkVendorRole(["VENDOR_ADMIN"]), VendorProfileController.updateVendorProfile);
VendorProfileRouter.post('/documents',verifyVendorToken, checkVendorRole(["VENDOR_ADMIN"]), VendorProfileController.uploadVendorDocuments);
VendorProfileRouter.get('/documents',verifyVendorToken, checkVendorRole(["VENDOR_ADMIN"]), VendorProfileController.getVendorDocuments); 
VendorProfileRouter.get('/vendor-user-profile',verifyVendorToken, checkVendorRole(["VENDOR_ADMIN", "PRODUCT_ADMIN"]), VendorProfileController.getVendorProfile);

export default VendorProfileRouter;  