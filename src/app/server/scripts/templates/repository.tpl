import prismaInstance from "@/app/server/config/prismaClientInstance";
import { HTTPException } from "hono/http-exception";
import { customLog } from "@/app/server/util/custom-log";
import { {{moduleNamePascal}} } from "@prisma/client";

export class {{moduleNamePascal}}Repository {
  private readonly prisma = prismaInstance;

  async get{{moduleNamePascal}}(): Promise<{{moduleNamePascal}}> {
    try {
      return {} as {{moduleNamePascal}};
    } catch (error) {
      customLog.error("Error fetching {{displayName}}", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      throw new HTTPException(status, { message: "Failed to fetch {{displayName}}" });
    }
  }
}