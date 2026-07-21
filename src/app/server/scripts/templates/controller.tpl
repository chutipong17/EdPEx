import { {{moduleNamePascal}}Service } from "./{{moduleName}}.service";
import { Context } from "hono";
import { customLog } from "@/app/server/util/custom-log";
import { HTTPException } from "hono/http-exception";
import { convertErrorMessage } from "../../util/common";

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
      const status = error instanceof HTTPException ? error.status : 500;
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? convertErrorMessage(error.message) : "{{displayName}} failed" },
        },
        status,
      );
    }
  };
}