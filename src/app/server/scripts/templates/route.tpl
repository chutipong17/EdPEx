import { OpenAPIHono } from "@hono/zod-openapi";
import { {{moduleNamePascal}}Controller } from "./{{moduleName}}.controller";

const {{moduleNameCamel}}Router = new OpenAPIHono();
const controller = new {{moduleNamePascal}}Controller();

{{moduleNameCamel}}Router.get("/", controller.get{{moduleNamePascal}});

export default {{moduleNameCamel}}Router;