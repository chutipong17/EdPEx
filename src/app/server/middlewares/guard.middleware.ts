import { Context, Next } from "hono";
import * as jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { convertBigIntToString } from "../util/common";
import { customLog } from "../util/custom-log";

const prisma = new PrismaClient();

/**
 * Authentication guard middleware for protecting routes
 * Verifies JWT token from Authorization header or cookies
 */
export const authGuard = async (c: Context, next: Next) => {
  customLog.info("Auth guard", { method: c.req.method, url: c.req.url });
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

  const JWT_SECRET = process.env.JWT_SECRET ?? "your-jwt-secret-key-for-development-only";

  try {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

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

    c.set("user", convertBigIntToString(user));

    await next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return c.json({ error: "Unauthorized - Invalid token" }, 401);
    } else if (error instanceof jwt.TokenExpiredError) {
      return c.json({ error: "Unauthorized - Token expired" }, 401);
    } else {
      customLog.error("Auth guard error", { error });
      return c.json({ error: "Internal server error" }, 500);
    }
  }
};

/**
 * Role-based authorization middleware
 * Must be used after authGuard middleware
 */
export const roleGuard = (allowedRoles: number[]) => {
  return async (c: Context, next: Next) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized - Authentication required" }, 401);
    }

    if (!allowedRoles.includes(user.role.id)) {
      return c.json({ error: "Forbidden - Insufficient permissions" }, 403);
    }

    await next();
  };
};

export const protectRoute = authGuard;
