import { customLog } from "@/app/server/util/custom-log";
import { {{moduleNamePascal}} } from "@prisma/client";
import { {{moduleNamePascal}}Repository } from "./{{moduleName}}.repository";
import { HTTPException } from "hono/http-exception";

export class {{moduleNamePascal}}Service {
  constructor(private readonly {{moduleNameCamel}}Repository = new {{moduleNamePascal}}Repository()) {}

  async get{{moduleNamePascal}}(): Promise<{{moduleNamePascal}}> {
    try {
      customLog.info("Getting {{displayName}} service");
      return await this.{{moduleNameCamel}}Repository.get{{moduleNamePascal}}();
    } catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof Error ? error.message : "Getting {{displayName}} failed";
      customLog.error("Error getting {{displayName}}: ", { message: errorMessage });
      throw new HTTPException(status, { message: errorMessage });
    }
  }
}