import express, { Router } from 'express';
import AppAuthRouter from './AppAuthRouter/AppAuthRouter';
import VendorAuthRouter from './VendorAuthRouter/VendorAuthRouter'; 
import VendorRouter from './VendorRouter/VendorRouter';
import VendorBankRouter from './VendorBankRoute/VendorBankRouter';
import VendorWarehouseRouter from './VendorWareHouseRoute/VendorWareHouseRoute';

const dashboardRouter: Router = express.Router();

dashboardRouter.use("/auth", AppAuthRouter);  
dashboardRouter.use("/vendor/auth", VendorAuthRouter);
dashboardRouter.use("/vendor", VendorRouter);
dashboardRouter.use("/vendor", VendorBankRouter);
dashboardRouter.use("/vendor", VendorWarehouseRouter);

export default dashboardRouter;

