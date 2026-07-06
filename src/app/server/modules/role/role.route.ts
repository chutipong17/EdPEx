import { OpenAPIHono } from "@hono/zod-openapi";
import { RoleController } from "./role.controller";

const roleRouter = new OpenAPIHono();
const controller = new RoleController();

roleRouter.get("/", controller.getRole);

export default roleRouter;