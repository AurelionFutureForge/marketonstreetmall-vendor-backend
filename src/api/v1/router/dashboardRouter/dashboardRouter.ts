import express, { Router } from 'express';
import { checkCMSRole, verifyCMSToken } from '../../middleware/roleBasedAuth';

const dashboardRouter: Router = express.Router();

// dashboardRouter.use("/products", verifyCMSToken, checkCMSRole(["SUPER_ADMIN"]), ProductRouter); Sample

export default dashboardRouter;