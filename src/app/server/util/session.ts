// lib/session.ts (หรือ utils/session.ts)

import { Context } from "hono";

interface SessionData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  phone: string;
  role: string;
}

/**
 * Parse raw cookie header string เป็น object ของ cookie key-value ทั้งหมด
 */
function parseCookieHeader(cookieHeader: string): Record<string, string> {
  return Object.fromEntries(
    cookieHeader.split("; ").map((c) => {
      const [key, ...v] = c.split("=");
      return [key, decodeURIComponent(v.join("="))];
    })
  );
}

/**
 * ดึง session data จาก Hono context
 * คืนค่า null ถ้าไม่มี cookie หรือ parse ไม่ได้
 */
export function getSession(c: Context): SessionData | null {
  const cookieHeader = c.req.header("cookie");
  if (!cookieHeader) return null;

  const cookies = parseCookieHeader(cookieHeader);
  const rawSession = cookies["edpex_session"];
  if (!rawSession) return null;

  try {
    return JSON.parse(rawSession) as SessionData;
  } catch {
    return null;
  }
}