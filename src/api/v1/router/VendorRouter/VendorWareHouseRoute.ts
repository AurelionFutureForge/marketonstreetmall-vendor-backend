import express, { Router } from 'express';
import { VendorWareHouseController } from '../../controller';
import { checkVendorlRole, verifyVendorToken } from '../../middleware/roleBasedAuth';
const VendorWarehouseRouter: Router = express.Router();

VendorWarehouseRouter.get('/', verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorWareHouseController.getWarehouse);
VendorWarehouseRouter.put('/', verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorWareHouseController.updateWarehouseVerification);
VendorWarehouseRouter.post('/', verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorWareHouseController.addOrUpdateWarehouse);
VendorWarehouseRouter.get('/verification-status', verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorWareHouseController.getWarehouseVerificationStatus);

export default VendorWarehouseRouter;