import { OpenAPIHono } from "@hono/zod-openapi";
import { DashboardController } from "./dashboard.controller";

const dashboardRouter = new OpenAPIHono();
const controller = new DashboardController();

dashboardRouter.post("/kpi-summary", controller.getDashboard);

export default dashboardRouter;