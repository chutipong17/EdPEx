import { OpenAPIHono } from "@hono/zod-openapi";
import { KpiCategoryController } from "./kpi-category.controller";
import { protectRoute } from "../../middlewares/guard.middleware";

const kpiCategoryRouter = new OpenAPIHono();
const controller = new KpiCategoryController();

kpiCategoryRouter.get("/", protectRoute, controller.getKpiCategory);
kpiCategoryRouter.get("/:id", protectRoute, controller.getKpiCategoryById);
kpiCategoryRouter.post("/", protectRoute, controller.createKpiCategory);
kpiCategoryRouter.patch("/:id", protectRoute, controller.updateKpiCategory);
kpiCategoryRouter.delete("/:id", protectRoute, controller.deleteKpiCategory);

export default kpiCategoryRouter;