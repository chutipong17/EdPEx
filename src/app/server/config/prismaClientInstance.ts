import { PrismaClient } from "@prisma/client";

// Define a custom Prisma client with connection handling
class PrismaClientWithConnectionHandling extends PrismaClient {
  constructor() {
    super({
      log: ["error"],
    });
  }

  async connect() {
    try {
      await this.$connect();
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Failed to connect to database:", error);
      // Try to reconnect after a delay
      setTimeout(() => this.connect(), 5000);
    }
  }

  async query<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      // Handle connection errors
      if (
        error.message.includes("Connection pool closed") ||
        error.message.includes("too many clients already") ||
        error.message.includes("Connection refused")
      ) {
        console.error("Database connection error. Attempting to reconnect...");
        await this.$disconnect();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await this.connect();
        // Retry the operation
        return await operation();
      }
      throw error;
    }
  }
}

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma?: PrismaClientWithConnectionHandling };

// Create a singleton instance of PrismaClient
const prismaInstance = globalForPrisma.prisma || new PrismaClientWithConnectionHandling();

// Ensure we don't create multiple instances in development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaInstance;

// Connect to the database on startup
prismaInstance.connect();

export default prismaInstance;

// Cleanup function to properly disconnect Prisma
export async function disconnectPrisma() {
  if (process.env.NODE_ENV === "production") {
    await prismaInstance.$disconnect();
  } else {
    await prismaInstance.$disconnect();
    delete globalForPrisma.prisma;
  }
}

/**
 * Executes a callback with a Prisma client instance and ensures proper cleanup
 * @param callback Function that receives the Prisma client and returns a Promise
 * @returns The result of the callback
 */
export const withPrisma = async <T>(
  callback: (prisma: PrismaClientWithConnectionHandling) => Promise<T>,
): Promise<T> => {
  try {
    return await callback(prismaInstance);
  } finally {
    await prismaInstance.$disconnect();
  }
};
