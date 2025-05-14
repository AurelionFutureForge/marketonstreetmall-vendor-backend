import express, { Router } from 'express';

import VendorAuthRouter from './VendorAuthRouter'; 
import VendorProfileRouter from './VendorProfileRouter';
import VendorBankRouter from './VendorBankRouter';
import VendorWarehouseRouter from './VendorWareHouseRoute';
import VendorUserRoute from './VendorUserRoute';
import VendorAdminRouter from './VendorAdminRouter';

const VendorRouter: Router = express.Router();

VendorRouter.use("/auth", VendorAuthRouter);
VendorRouter.use("/admin", VendorAdminRouter);

VendorRouter.use("/user", VendorUserRoute);
VendorRouter.use("/profile", VendorProfileRouter);
VendorRouter.use("/bank", VendorBankRouter);
VendorRouter.use("/warehouse", VendorWarehouseRouter);

export default VendorRouter;