// import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { ContextVariableMap } from "hono";
import { getCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import * as jwt from "jsonwebtoken";
import { verifyAccessToken } from "./config/jwt";
import { Role } from "./enum/enum";
import approveStatusRouter from "./modules/approve-status/approve-status.route";
import authRouter from "./modules/auth/auth.route";
import departmentRouter from "./modules/departments/department.route";
import frequencyRouter from "./modules/frequency/frequency.route";
import healthCheckRouter from "./modules/health-check/health-check.route";
import kpiCategoryRouter from "./modules/kpi-category/kpi-category.route";
import kpiRouter from "./modules/kpi/kpi.route";
import monthOfDeliveryRouter from "./modules/month-of-delivery/month-of-delivery.route";
import roleRouter from "./modules/role/role.route";
import targetConditionRouter from "./modules/target-condition/target-condition.route";
import userRouter from "./modules/user/user.route";
import { getSession } from "./util/session";
import dashboardRouter from "./modules/dashboard/dashboard.route";

declare module "hono" {
  interface ContextVariableMap {
    user: {
      role?: any;
      id: number;
      email: string;
      firstName: string | null;
      lastName: string | null;
      mobileNumber: string | null;
      department: unknown;
      isActive: boolean;
      isDeleted: boolean;
    };
    userId: string;
    fullName: string;
  }
}

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

app.use("*", async (c, next) => {
  console.info("Auth guard", {
    method: c.req.method,
    url: c.req.url,
  });

  try {
    const isSignInRoute =
      c.req.path === "/api/auth/sign-in" ||
      c.req.path === "/api/auth/sign-in/" ||
      c.req.path.startsWith("/api/auth/sign-in");

    const isSignUpRoute =
      c.req.path === "/api/auth/sign-up" ||
      c.req.path === "/api/auth/sign-up/" ||
      c.req.path.startsWith("/api/auth/sign-up");

    const isHealthCheckRoute =
      c.req.path === "/api/health-check" ||
      c.req.path === "/api/health-check/" ||
      c.req.path.startsWith("/api/health-check");

    if (isSignInRoute || isSignUpRoute || isHealthCheckRoute) {
      console.info("Sign-in or Sign-up or health check route, skipping auth guard");
      return await next();
    }

    // 1. Try Authorization header first
    let token = c.req
      .header("Authorization")
      ?.replace(/^Bearer\s+/i, "");

    // 2. If no Authorization token, get token from cookie
    if (!token) {
      token = getCookie(c, "edpex-session");
    }

    const session = getSession(c);
    if (!session && !token) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    let payload;
    if (token) {
      payload = verifyAccessToken(token);
    }

    const user: ContextVariableMap["user"] = {
      role: session?.role == null ? Role[Number(payload?.roleId)] : session?.role,
      id: Number(session?.id) || Number(payload?.sub),
      email: session?.email ?? payload?.email ?? "",
      firstName: session?.firstName ?? "",
      lastName: session?.lastName ?? "",
      mobileNumber: session?.phone ?? "",
      department: session?.department ?? "",
      isActive: true,
      isDeleted: false,
    };

    const fullName = token
      ? payload?.fullName ?? [user.firstName, user.lastName].filter(Boolean).join(" ")
      : [user.firstName, user.lastName].filter(Boolean).join(" ");

    // // 6. Set data into current Hono context
    c.set("user", user);
    c.set("userId", user.id.toString());
    c.set("fullName", fullName);

    // 7. Continue to controller
    await next();

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return c.json(
        { error: "Unauthorized - Token expired" },
        401
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return c.json(
        { error: "Unauthorized - Invalid token" },
        401
      );
    }

    console.error("Auth guard error", { error });

    return c.json(
      { error: "Internal server error" },
      500
    );
  }
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
app.route("/kpi", kpiRouter);
app.route("/dashboard", dashboardRouter);

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
