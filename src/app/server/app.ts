// import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import healthCheckRouter from "./modules/health-check/health-check.route";
import roleRouter from "./modules/role/role.route";
import monthOfDeliveryRouter from "./modules/month-of-delivery/month-of-delivery.route";
import targetConditionRouter from "./modules/target-condition/target-condition.route";
import frequencyRouter from "./modules/frequency/frequency.route";
import approveStatusRouter from "./modules/approve-status/approve-status.route";
import authRouter from "./modules/auth/auth.route";
import userRouter from "./modules/user/user.route";
import kpiCategoryRouter from "./modules/kpi-category/kpi-category.route";
import departmentRouter from "./modules/departments/department.route";

export const runtime = "node";

const app = new OpenAPIHono().basePath("/api");

// Apply middleware
app.use("*", logger());
app.use("*", secureHeaders());
app.use(
  cors({
    origin: "http://localhost:3000",
    allowHeaders: ["Content-Type", "Authorization", "X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST", "GET", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

// Log middleware for HTTP requests
app.use("*", (c, next) => {
  console.info("Request received", { method: c.req.method, url: c.req.url });
  // Replace with your custom logger when ready
  // customLog.info("Request received", { method: c.req.method, url: c.req.url });
  return next();
});

// Swagger UI routes (disabled in production)
// app.use("/swagger/json", async (c, next) => {
//   if (process.env.NODE_ENV === "production") {
//     return c.text("Not found", 404);
//   }
//   return await next();
// });

// app.use("/swagger", async (c, next) => {
//   if (process.env.NODE_ENV === "production") {
//     return c.text("Not found", 404);
//   }
//   return await next();
// });

// Helper function to protect routes with authGuard
// Uncomment when you have authGuard ready
/*
const protectRoute = (router: Hono | OpenAPIHono) => {
  const protectedRouter = new Hono();
  protectedRouter.use("*", authGuard);
  protectedRouter.route("/", router as Hono);
  return protectedRouter;
};
*/

// Add more module routes as you create them
app.route("/health-check", healthCheckRouter);
app.route("/role", roleRouter);
app.route("/month-of-delivery", monthOfDeliveryRouter);
app.route("/target-condition", targetConditionRouter);
app.route("/frequency", frequencyRouter);
app.route("/approve-status", approveStatusRouter);
app.route("/auth", authRouter);
app.route("/user", userRouter);
app.route("/kpi-category", kpiCategoryRouter);
app.route("/department", departmentRouter);

// Serve OpenAPI JSON
// app.doc("/swagger/json", {
//   openapi: "3.1.0",
//   info: {
//     title: "Hub of Knowledge API",
//     version: "1.0.0",
//   },
// });

// // Serve Swagger UI
// app.get(
//   "/swagger",
//   swaggerUI({
//     url: "/api/swagger/json",
//   }),
// );

export const handler = app;
export default app;
