import { OpenAPIHono } from "@hono/zod-openapi";
import { TargetConditionController } from "./target-condition.controller";

const targetConditionRouter = new OpenAPIHono();
const controller = new TargetConditionController();

targetConditionRouter.get("/", controller.getTargetCondition);

export default targetConditionRouter;