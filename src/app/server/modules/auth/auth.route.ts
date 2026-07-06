import { OpenAPIHono } from "@hono/zod-openapi";
import { AuthController } from "./auth.controller";
import { signUpValidator } from "../../validator/sign-up.validator";
import { signInValidator } from "../../validator/sign-in.validator";

const authRouter = new OpenAPIHono();
const controller = new AuthController();

authRouter.get("/", controller.getAuth);
authRouter.post("/sign-out", controller.signOut);
authRouter.post(
  "/sign-up",
  signUpValidator,
  async (c) => {
    const body = c.req.valid("json");
    return controller.signUp(c, body);
  }
);
authRouter.post(
  "/sign-in",
  signInValidator,
  async (c) => {
    const body = c.req.valid("json");
    return controller.signIn(c, body);
  }
);

export default authRouter;