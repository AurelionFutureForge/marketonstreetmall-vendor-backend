import express, { Router } from 'express';
import { VendorWareHouseController } from '../../controller';
import { checkVendorRole, verifyVendorToken } from '../../middleware/roleBasedAuth';
const VendorWarehouseRouter: Router = express.Router();

VendorWarehouseRouter.get('/', verifyVendorToken, checkVendorRole(["VENDOR_ADMIN"]), VendorWareHouseController.getWarehouse);
VendorWarehouseRouter.put('/', verifyVendorToken, checkVendorRole(["VENDOR_ADMIN"]), VendorWareHouseController.updateWarehouseVerification);
VendorWarehouseRouter.post('/', verifyVendorToken, checkVendorRole(["VENDOR_ADMIN"]), VendorWareHouseController.addOrUpdateWarehouse);
VendorWarehouseRouter.get('/verification-status', verifyVendorToken, checkVendorRole(["VENDOR_ADMIN"]), VendorWareHouseController.getWarehouseVerificationStatus);

export default VendorWarehouseRouter;