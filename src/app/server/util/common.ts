import { Prisma } from "@prisma/client";

/**
 * Recursively converts BigInt values to strings in an object or array.
 *
 * @param obj - The input object or array to process.
 * @returns A new object or array with BigInt values converted to strings.
 *
 * @example
 * const input = { id: BigInt(123), name: "John", ages: [BigInt(30), BigInt(40)] };
 * const result = convertBigIntToString(input);
 * // Result: { id: "123", name: "John", ages: ["30", "40"] }
 */
export function convertBigIntToString(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  } else if (obj instanceof Date) {
    return obj.toISOString();
  } else if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k,
        typeof v === "bigint" ? v.toString() : convertBigIntToString(v),
      ]),
    );
  }
  return obj;
}

/**
 * Converts 'createdAt' and 'updatedAt' ISO string fields to local time string (YYYY-MM-DD HH:mm:ss)
 * Handles both objects and arrays recursively.
 *
 * @param obj - The input object or array to process.
 * @returns A new object or array with 'createdAt' and 'updatedAt' fields converted to local time strings.
 *
 * @example
 * const input = {
 *   createdAt: "2023-05-15T10:30:00Z",
 *   updatedAt: "2023-05-16T14:45:00Z",
 *   name: "John"
 * };
 * const result = convertDatesToLocalTime(input);
 * // Result: {
 * //   createdAt: "2023-05-15 06:30:00",
 * //   updatedAt: "2023-05-16 10:45:00",
 * //   name: "John"
 * // }
 */
export function convertDatesToLocalTime(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertDatesToLocalTime);
  } else if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => {
        if (
          (k === "createdAt" || k === "updatedAt") &&
          typeof v === "string" &&
          !isNaN(Date.parse(v))
        ) {
          const date = new Date(v);
          // Format as YYYY-MM-DD HH:mm:ss in local time
          const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, "0");
          const dd = String(date.getDate()).padStart(2, "0");
          const hh = String(date.getHours()).padStart(2, "0");
          const min = String(date.getMinutes()).padStart(2, "0");
          const ss = String(date.getSeconds()).padStart(2, "0");
          return [k, `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`];
        } else {
          return [k, convertDatesToLocalTime(v)];
        }
      }),
    );
  }
  return obj;
}

export function convertserialNumberToISODate(serialNumber: number) {
  if (!serialNumber || typeof serialNumber !== "number") {
    serialNumber = convertDateStringToserialNumber(serialNumber.toString());
  }

  const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel starts at 30 Dec 1899
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  const date = new Date(excelEpoch.getTime() + serialNumber * millisecondsPerDay);
  return date.toISOString();
}

export function convertDateStringToserialNumber(stringDate: string) {
  const [day, month, year] = stringDate.split("/").map(Number);
  const excelEpoch = new Date(1899, 11, 30);
  const inputDate = new Date(year, month - 1, day);

  const diffTime = inputDate.getTime() - excelEpoch.getTime();
  const serialNumber = diffTime / (1000 * 60 * 60 * 24);

  return Math.round(serialNumber);
}

export function convertDateString(stringDate: string) {
  const parts = stringDate.split("/");

  if (parts.length !== 3) {
    throw new Error(`Invalid date format: "${stringDate}". Expected format: dd/mm/yyyy`);
  }

  const [dayStr, monthStr, yearStr] = parts;

  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  let year = parseInt(yearStr, 10);

  if (yearStr.length === 2) {
    year += 2000;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toISOString();
}

export function toNullableNumber(value: any): number | null {
  return value !== undefined ? Number(value) : null;
}

export function convertErrorMessage(value: string): string | null {
  return value !== undefined ? value.split("Error:")[1]?.trim() : null;
}

export function calculateTokenExpiryDate(tokenExpiry: number): Date {
  return new Date(Date.now() + tokenExpiry * 1000);
}

export function buildUpdateData<T>(value: T | undefined): { set: T } | undefined {
    return value !== undefined ? { set: value } : undefined;
  }

export function toDecimalUpdate(value: number | null | undefined) {
  if (value === undefined) return undefined;
  return { set: value === null ? null : new Prisma.Decimal(value) };
}