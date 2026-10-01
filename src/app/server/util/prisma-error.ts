import { Prisma } from "@prisma/client";
import { HTTPException } from "hono/http-exception";
import { ContentfulStatusCode } from "hono/utils/http-status";

interface PrismaErrorInfo {
  status: ContentfulStatusCode;
  message: string;
}

export const PRISMA_ERROR_MAP: Record<string, PrismaErrorInfo> = {
  // ---------- P1xxx: Connection / Config ----------
  P1000: { status: 500, message: "ไม่สามารถยืนยันตัวตนกับฐานข้อมูลได้" },
  P1001: { status: 503, message: "ไม่สามารถเชื่อมต่อฐานข้อมูลได้" },
  P1008: { status: 504, message: "การทำงานหมดเวลา" },
  P1012: { status: 500, message: "Schema ไม่ถูกต้อง" },
  P1013: { status: 500, message: "Connection string ไม่ถูกต้อง" },
 
  // ---------- P2xxx: Query ----------
  P2000: { status: 400, message: "ข้อมูลยาวเกินกว่าที่ฟิลด์รองรับ" },
  P2002: { status: 409, message: "ข้อมูลซ้ำกับที่มีอยู่แล้ว" },
  P2003: { status: 400, message: "ข้อมูลอ้างอิง (Foreign Key) ไม่ถูกต้อง" },
  P2025: { status: 404, message: "ไม่พบข้อมูลที่ต้องการ" },
 
  // ---------- P3xxx: Migration ----------
  P3000: { status: 500, message: "สร้างฐานข้อมูลสำหรับ migration ไม่สำเร็จ" },
  P3001: { status: 500, message: "Migration ถูกยกเลิกเนื่องจากพบความเสี่ยง" },
  P3008: { status: 500, message: "Migration ล้มเหลวหรือค้างอยู่" },
};
 
const DEFAULT_ERROR: PrismaErrorInfo = {
  status: 500,
  message: "เกิดข้อผิดพลาดกับฐานข้อมูล",
};

/** ดึงชื่อฟิลด์จาก meta.target (SQL Server อาจเป็น string หรือ array) */
function getTargetFields(error: Prisma.PrismaClientKnownRequestError): string | undefined {
  const target = error.meta?.target;
  if (Array.isArray(target)) return target.join(", ");
  if (typeof target === "string") return target;
  return undefined;
}
 
/** ดึง code จาก error ทุกประเภทของ Prisma (ถ้ามี) */
export function getPrismaErrorCode(error: unknown): string | undefined {
  if (error instanceof Prisma.PrismaClientKnownRequestError) return error.code;
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return error.errorCode ?? (error as { code?: string }).code;
  }
  return undefined;
}
 
export function isPrismaError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientValidationError ||
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientRustPanicError
  );
}
 
/** แปลง error ใด ๆ ให้เป็น { status, message, code } */
export function mapPrismaError(error: unknown): PrismaErrorInfo & { code?: string } {
  // Query / known errors (P2xxx, P3xxx)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const info = PRISMA_ERROR_MAP[error.code] ?? DEFAULT_ERROR;
    let message = info.message;
 
    if (error.code === "P2002") {
      const fields = getTargetFields(error);
      if (fields) message = `${info.message} (${fields})`;
    }
    return { ...info, message, code: error.code };
  }
 
  // Connection errors (P1xxx) — Prisma โยนเป็น InitializationError
  if (error instanceof Prisma.PrismaClientInitializationError) {
    const code = error.errorCode;
    const info = (code && PRISMA_ERROR_MAP[code]) || {
      status: 503 as ContentfulStatusCode,
      message: "ไม่สามารถเชื่อมต่อฐานข้อมูลได้",
    };
    return { ...info, code };
  }
 
  // ส่งข้อมูลผิดรูปแบบ/ขาดฟิลด์ (ไม่มี code)
  if (error instanceof Prisma.PrismaClientValidationError) {
    return { status: 400, message: "ข้อมูลที่ส่งมาไม่ถูกต้อง", code: "VALIDATION" };
  }
 
  return { ...DEFAULT_ERROR, code: undefined };
}
 
/**
 * ใช้ใน catch: log แล้ว throw HTTPException ที่ map แล้ว
 * - HTTPException ที่มีอยู่แล้วจะถูก throw ต่อโดยไม่แก้
 * - ใส่ overrides เพื่อกำหนดข้อความเฉพาะบาง code ได้
 */
export function handlePrismaError(
  error: unknown,
  context: string,
  overrides: Partial<Record<string, string>> = {},
): never {
  if (error instanceof HTTPException) throw error;
 
  const mapped = mapPrismaError(error);
  const message = (mapped.code && overrides[mapped.code]) || mapped.message;
 
  // customLog.error(`Prisma error: ${context}`, { code: mapped.code, error });
  console.error(`[Prisma] ${context}`, { code: mapped.code, error });
 
  throw new HTTPException(mapped.status, {
    message,
    cause: error,
  });
}