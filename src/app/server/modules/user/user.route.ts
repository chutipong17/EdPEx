import { OpenAPIHono } from "@hono/zod-openapi";
import { UserController } from "./user.controller";

const userRouter = new OpenAPIHono();
const controller = new UserController();

userRouter.get("/", controller.getAllUsers);
userRouter.get("/:id", controller.getUserById);
userRouter.post("/search", controller.searchUsers);
userRouter.patch("/:id", controller.updateUser);
userRouter.delete("/:id", controller.deleteUser);

export default userRouter;