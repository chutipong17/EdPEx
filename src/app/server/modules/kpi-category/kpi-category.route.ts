import { OpenAPIHono } from "@hono/zod-openapi";
import { KpiCategoryController } from "./kpi-category.controller";
import { protectRoute } from "../../middlewares/guard.middleware";

const kpiCategoryRouter = new OpenAPIHono();
const controller = new KpiCategoryController();

kpiCategoryRouter.get("/", controller.getKpiCategory);
kpiCategoryRouter.get("/:id", controller.getKpiCategoryById);
kpiCategoryRouter.post("/", controller.createKpiCategory);
kpiCategoryRouter.patch("/:id", controller.updateKpiCategory);
kpiCategoryRouter.delete("/:id", controller.deleteKpiCategory);

export default kpiCategoryRouter;