// import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import healthCheckRouter from "./modules/health-check/health-check.route";

// Import modules
// import { activityModule } from "./modules/activity/activity.module";
// import { userModule } from "./modules/user/user.module";

// Import utilities and middlewares
// Uncomment and adapt these as needed
// import { authGuard } from "../middlewares/gaurd.middleware";
// import { customLog } from "../utils/custom-log";
// import { authModule } from "./modules/auth/auth.module";
// import { certificateModule } from "./modules/certificate/certificate.module";
// import { dashboardModule } from "./modules/dashboard/dashboard.module";
// import { evaluateScoreModule } from "./modules/evaluate-score/evaluate-score.module";
// import { exportModule } from "./modules/export/export.module";
// import { fileModule } from "./modules/file/file.module";
// import { masterDataModule } from "./modules/master-data/master-data.module";
// import { memberModule } from "./modules/member/member.module";
// import { publicRelationModule } from "./modules/public-relation/public-relation.module";
// import { regionModule } from "./modules/region/region.module";
// import { signatureModule } from "./modules/signature/signature.module";
// import { teamMemberModule } from "./modules/team-member/team-member.module";
// import { thesisModule } from "./modules/thesis/thesis.module";
// import { userActivitiesModule } from "./modules/user-activities/user-activities.module";
// import { visitorModule } from "./modules/visitor/visitor.module";
import roleRouter from "./modules/role/role.route";
import monthOfDeliveryRouter from "./modules/month-of-delivery/month-of-delivery.route";
import targetConditionRouter from "./modules/target-condition/target-condition.route";
import frequencyRouter from "./modules/frequency/frequency.route";
import approveStatusRouter from "./modules/approve-status/approve-status.route";
import authRouter from "./modules/auth/auth.route";
import userRouter from "./modules/user/user.route";
import kpiCategoryRouter from "./modules/kpi-category/kpi-category.route";

export const runtime = "node";

const app = new OpenAPIHono().basePath("/api");

// Apply middleware
app.use("*", logger());
app.use("*", secureHeaders());
app.use(
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST", "GET", "PUT", "PATCH", "DELETE", "OPTIONS"],
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


// Register modules
// When you have authGuard ready, you can use: app.route("/user", protectRoute(userModule));
// app.route("/user", userModule);

app.route("/health-check", healthCheckRouter);

// Add more module routes as you create them
// app.route("/activity", activityModule);
// app.route("/auth", authModule);
// app.route("/certificate", certificateModule);
// app.route("/dashboard", dashboardModule);
// app.route("/evaluate-score", evaluateScoreModule);
// app.route("/export", exportModule);
// app.route("/file", fileModule);
// app.route("/master-data", masterDataModule);
// app.route("/region", regionModule);
// app.route("/team-member", teamMemberModule);
// app.route("/user-activities", userActivitiesModule);
// app.route("/visitor", visitorModule);
// app.route("/public-relation", publicRelationModule);
// app.route("/member", memberModule);
// app.route("/signature", signatureModule);
// app.route("/theses", thesisModule);
app.route("/role", roleRouter);
app.route("/month-of-delivery", monthOfDeliveryRouter);
app.route("/target-condition", targetConditionRouter);
app.route("/frequency", frequencyRouter);
app.route("/approve-status", approveStatusRouter);
app.route("/auth", authRouter);
app.route("/user", userRouter);
app.route("/kpi-category", kpiCategoryRouter);

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
