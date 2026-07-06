import { OpenAPIHono } from "@hono/zod-openapi";
import { MonthOfDeliveryController } from "./month-of-delivery.controller";

const monthOfDeliveryRouter = new OpenAPIHono();
const controller = new MonthOfDeliveryController();

monthOfDeliveryRouter.get("/", controller.getMonthOfDelivery);

export default monthOfDeliveryRouter;