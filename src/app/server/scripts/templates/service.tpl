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
      customLog.error("Error getting {{displayName}}", { error });
      throw new Error("{{displayName}} failed");
    }
  }
}