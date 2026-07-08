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
      throw new HTTPException(400, { message: "Failed to fetch {{displayName}}" });
    }
  }
}