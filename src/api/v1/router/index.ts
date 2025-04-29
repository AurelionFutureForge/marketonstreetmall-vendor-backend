import express,{ Router } from 'express';
import VendorRouter from './VendorRouter';

const apiRouter: Router = express.Router();

apiRouter.use("/vendor", VendorRouter);

export default apiRouter;