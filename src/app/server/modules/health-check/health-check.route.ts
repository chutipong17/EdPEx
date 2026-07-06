import { OpenAPIHono } from "@hono/zod-openapi";
import { HealthCheckController } from "./health-check.controller";

const healthCheckRouter = new OpenAPIHono();
const controller = new HealthCheckController();

healthCheckRouter.get("/", controller.getHealthCheck);

export default healthCheckRouter;
