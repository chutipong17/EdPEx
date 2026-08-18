import { OpenAPIHono } from "@hono/zod-openapi";
import { KpiController } from "./kpi.controller";
import { kpiValidator } from "../../validator/validator";

const kpiRouter = new OpenAPIHono();
const controller = new KpiController();

kpiRouter.get("/", controller.getKpi);
kpiRouter.get("/:id", controller.getKpiById);
kpiRouter.get("/department/:departmentId", controller.getKpiByDepartment);
kpiRouter.delete("/:id", controller.deleteKpi);
kpiRouter.patch("/:id/kpi-submission", controller.updateKpiSubmission);
kpiRouter.post(
  "/",
  kpiValidator,
  async (c) => {
    const body = c.req.valid("json");
    return controller.createKpi(c, body);
  }
);
kpiRouter.patch(
  "/:id",
  kpiValidator,
  async (c) => {
    const body = c.req.valid("json");
    return controller.updateKpi(c, body);
  }
);
// kpiRouter.get("/department/:departmentId/user/:userId", controller.getKpiByDepartment);

export default kpiRouter;