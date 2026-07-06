import { OpenAPIHono } from "@hono/zod-openapi";
import { FrequencyController } from "./frequency.controller";

const frequencyRouter = new OpenAPIHono();
const controller = new FrequencyController();

frequencyRouter.get("/", controller.getFrequency);

export default frequencyRouter;