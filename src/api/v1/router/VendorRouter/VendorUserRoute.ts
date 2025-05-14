import express from 'express';
import { checkVendorRole, verifyVendorToken } from '../../middleware/roleBasedAuth';
import { VendorUserController } from '../../controller';

const VendorUserRoute = express.Router();

VendorUserRoute.get('/', verifyVendorToken, checkVendorRole(["VENDOR_ADMIN"]), VendorUserController.getVendorUsersController);
VendorUserRoute.post('/', verifyVendorToken, checkVendorRole(["VENDOR_ADMIN"]), VendorUserController.addVendorUserController);
VendorUserRoute.delete('/', verifyVendorToken, checkVendorRole(["VENDOR_ADMIN"]), VendorUserController.deleteVendorUserController);
VendorUserRoute.put('/', verifyVendorToken, checkVendorRole(["VENDOR_ADMIN", "PRODUCT_ADMIN"]), VendorUserController.updateVendorUserController);

export default VendorUserRoute;
