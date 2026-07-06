import { {{moduleNamePascal}}Service } from "./{{moduleName}}.service";
import { Context } from "hono";
import { customLog } from "@/app/server/util/custom-log";

export class {{moduleNamePascal}}Controller {
  constructor(
    private readonly {{moduleNameCamel}}Service = new {{moduleNamePascal}}Service()
  ) {}

  get{{moduleNamePascal}} = async (c: Context) => {
    try {
      const {{moduleNameCamel}} = await this.{{moduleNameCamel}}Service.get{{moduleNamePascal}}();

      return c.json({
        success: true,
        data: {{moduleNameCamel}},
      });
    } catch (error) {
      customLog.error("Error getting {{displayName}}", { error });
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? error.message : "{{displayName}} failed" },
        },
        400,
      );
    }
  };
}