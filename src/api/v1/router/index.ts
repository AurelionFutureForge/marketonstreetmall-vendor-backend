import express,{ Router } from 'express';
import dashboardRouter from './dashboardRouter/dashboardRouter';

const apiRouter: Router = express.Router();

// apiRouter.use("/app", dashboardRouter);
apiRouter.use("/dashboard", dashboardRouter);

export default apiRouter;