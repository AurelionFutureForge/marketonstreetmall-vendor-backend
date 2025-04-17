import express, { Router } from 'express';
import AppAuthRouter from '../dashboardRouter/AppAuthRouter/AppAuthRouter';
import VendorAuthRouter from '../dashboardRouter/VendorRouter/VendorAuthRouter'; 
const appRouter: Router = express.Router();

appRouter.use("/auth", AppAuthRouter);  
appRouter.use("/vendor/auth", VendorAuthRouter);

export default appRouter;