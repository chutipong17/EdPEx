import { OpenAPIHono } from "@hono/zod-openapi";
import { DashboardController } from "./dashboard.controller";

const dashboardRouter = new OpenAPIHono();
const controller = new DashboardController();

dashboardRouter.post("/kpi-summary", controller.getDashboard);
dashboardRouter.post("/kpi-comparison", controller.getKpiComparisonDashboard);

export default dashboardRouter;