import express from 'express';
import { checkVendorlRole, verifyVendorToken } from '../../middleware/roleBasedAuth';
import { VendorUserController } from '../../controller';

const VendorUserRoute = express.Router();

VendorUserRoute.post('/', verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorUserController.addVendorUserController);
VendorUserRoute.get('/', verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorUserController.getVendorUsersController);
VendorUserRoute.delete('/', verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorUserController.deleteVendorUserController);
VendorUserRoute.put('/', verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorUserController.updateVendorUserController);

export default VendorUserRoute;
