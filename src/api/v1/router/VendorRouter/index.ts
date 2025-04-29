import express, { Router } from 'express';

import VendorAuthRouter from './VendorAuthRouter'; 
import VendorProfileRouter from './VendorProfileRouter';
import VendorBankRouter from './VendorBankRouter';
import VendorWarehouseRouter from './VendorWareHouseRoute';
import VendorUserRoute from './VendorUserRoute';
import VendorAdminRouter from './VendorAdminRouter';

const VendorRouter: Router = express.Router();

VendorRouter.use("/auth", VendorAuthRouter);
VendorRouter.use("/profile", VendorProfileRouter);
VendorRouter.use("/bank", VendorBankRouter);
VendorRouter.use("/user", VendorUserRoute);
VendorRouter.use("/warehouse", VendorWarehouseRouter);
VendorRouter.use("/admin", VendorAdminRouter);

export default VendorRouter;