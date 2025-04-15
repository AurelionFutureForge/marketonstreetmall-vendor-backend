import express, { Router } from 'express';
import { VendorWareHouseController } from '../../../controller/dashboard';
import { checkVendorlRole, verifyVendorToken } from '../../../middleware/roleBasedAuth';
const VendorWarehouseRouter: Router = express.Router();

// Authentication endpoints
VendorWarehouseRouter.get('/warehouse',verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorWareHouseController.getWarehouse);
VendorWarehouseRouter.put('/warehouse',verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorWareHouseController.updateWarehouseVerification);
VendorWarehouseRouter.post('/warehouse',verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorWareHouseController.addOrUpdateWarehouse);
VendorWarehouseRouter.get('/warehouse/verification-status',verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorWareHouseController.getWarehouseVerificationStatus);

export default VendorWarehouseRouter;