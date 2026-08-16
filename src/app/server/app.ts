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
import kpiRouter from "./modules/kpi/kpi.route";
import { verifyAccessToken } from "./config/jwt";
import * as jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

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
      createdAt: Date | null;
      updatedAt: Date | null;
      createdBy: string | null;
      updatedBy: string | null;
    };
    userId: string;
    fullName: string;
  }
}

const prisma = new PrismaClient();

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
  console.info("Auth guard", { method: c.req.method, url: c.req.url });
  let token = c.req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    const cookieHeader = c.req.header("cookie");
    if (cookieHeader) {
      const cookies = cookieHeader.split(";").reduce((acc: Record<string, string>, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
      }, {});

      token = cookies["edpex-session"];
    }
  }

  if (!token) {
    return c.json({ error: "Unauthorized - No token provided" }, 401);
  }

  // const JWT_SECRET = process.env.JWT_SECRET ?? "your-jwt-secret-key-for-development-only";

  try {
    const payload = verifyAccessToken(token);

    if (!payload.sub) {
      return c.json({ error: "Unauthorized - Invalid token" }, 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.sub) },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        mobileNumber: true,
        department: true,
        isActive: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
        updatedBy: true,
      },
    });

    if (!user) {
      return c.json({ error: "Unauthorized - User not found" }, 401);
    }

    const fullName = [user.firstName, user.lastName]
      .filter(Boolean)
      .join(" ");

    c.set("user", user);
    c.set("userId", user.id.toString());
    c.set("fullName", fullName);

    await next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return c.json({ error: "Unauthorized - Invalid token" }, 401);
    } else if (error instanceof jwt.TokenExpiredError) {
      return c.json({ error: "Unauthorized - Token expired" }, 401);
    } else {
      console.error("Auth guard error", { error });
      return c.json({ error: "Internal server error" }, 500);
    }
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
