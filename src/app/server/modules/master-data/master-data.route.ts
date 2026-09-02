import { OpenAPIHono } from "@hono/zod-openapi";
import { MasterDataController } from "./master-data.controller";

const masterDataRouter = new OpenAPIHono();
const controller = new MasterDataController();

masterDataRouter.get("/kpi-filter", controller.getKpiFilter);

export default masterDataRouter;