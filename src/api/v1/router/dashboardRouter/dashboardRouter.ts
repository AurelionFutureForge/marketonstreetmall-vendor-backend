import express, { Router } from 'express';

import VendorAuthRouter from './VendorRouter/VendorAuthRouter'; 
import VendorRouter from './VendorRouter/VendorRouter';
import VendorBankRouter from './VendorBankRoute/VendorBankRouter';
import VendorWarehouseRouter from './VendorWareHouseRoute/VendorWareHouseRoute';
import VendorUserRoute from './VendorUserRoute/VendorUserRoute';

const dashboardRouter: Router = express.Router();

  
dashboardRouter.use("/vendor/auth", VendorAuthRouter);
dashboardRouter.use("/vendor", VendorRouter);
dashboardRouter.use("/vendor", VendorBankRouter);
dashboardRouter.use("/vendor", VendorUserRoute);
dashboardRouter.use("/vendor", VendorWarehouseRouter);

export default dashboardRouter;

