import express from 'express';
import { checkVendorlRole, verifyVendorToken } from '../../middleware/roleBasedAuth';
import { VendorUserController } from '../../controller';

const VendorUserRoute = express.Router();

VendorUserRoute.post('/user', verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorUserController.addVendorUserController);
VendorUserRoute.get('/user', verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorUserController.getVendorUsersController);
VendorUserRoute.delete('/user', verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorUserController.deleteVendorUserController);
VendorUserRoute.put('/user', verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorUserController.updateVendorUserController);

export default VendorUserRoute;
