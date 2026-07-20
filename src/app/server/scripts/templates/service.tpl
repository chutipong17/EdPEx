import { customLog } from "@/app/server/util/custom-log";
import { {{moduleNamePascal}} } from "@prisma/client";
import { {{moduleNamePascal}}Repository } from "./{{moduleName}}.repository";

export class {{moduleNamePascal}}Service {
  constructor(private readonly {{moduleNameCamel}}Repository = new {{moduleNamePascal}}Repository()) {}

  async get{{moduleNamePascal}}(): Promise<{{moduleNamePascal}}> {
    try {
      customLog.info("Getting {{displayName}} service");
      return this.{{moduleNameCamel}}Repository.get{{moduleNamePascal}}();
    } catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      customLog.error("Error creating department: ", { message: `${error}` || "Getting {{displayName}} failed" });
      throw new HTTPException(status, { message: `${error}` || "Getting {{displayName}} failed" });
    }
  }
}