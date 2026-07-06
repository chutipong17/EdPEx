import { OpenAPIHono } from "@hono/zod-openapi";
import { UserController } from "./user.controller";

const userRouter = new OpenAPIHono();
const controller = new UserController();

userRouter.get("/", controller.getUser);

export default userRouter;