import express, { Router } from 'express';
import VendorAuthRouter from '../dashboardRouter/VendorRouter/VendorAuthRouter'; 
const appRouter: Router = express.Router();

appRouter.use("/vendor/auth", VendorAuthRouter);

export default appRouter;