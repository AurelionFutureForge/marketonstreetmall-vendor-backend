import express,{ Router } from 'express';
import appRouter from './appRouter/appRouter';
import dashboardRouter from './dashboardRouter/dashboardRouter';

const apiRouter: Router = express.Router();

apiRouter.use("/app", appRouter);
apiRouter.use("/dashboard", dashboardRouter);

export default apiRouter;