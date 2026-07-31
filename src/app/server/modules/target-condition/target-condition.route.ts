import { OpenAPIHono } from "@hono/zod-openapi";
import { TargetConditionController } from "./target-condition.controller";
import { protectRoute } from "../../middlewares/guard.middleware";

const targetConditionRouter = new OpenAPIHono();
const controller = new TargetConditionController();

targetConditionRouter.get("/", protectRoute, controller.getTargetCondition);

export default targetConditionRouter;