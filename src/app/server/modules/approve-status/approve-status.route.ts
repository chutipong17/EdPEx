import { OpenAPIHono } from "@hono/zod-openapi";
import { ApproveStatusController } from "./approve-status.controller";

const approveStatusRouter = new OpenAPIHono();
const controller = new ApproveStatusController();

approveStatusRouter.get("/", controller.getApproveStatus);

export default approveStatusRouter;