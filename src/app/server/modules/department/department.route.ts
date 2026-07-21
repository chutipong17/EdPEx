import { OpenAPIHono } from "@hono/zod-openapi";
import { DepartmentController } from "./department.controller";
import { protectRoute } from "../../middlewares/guard.middleware";
import { departmentValidator } from "../../validator/validator";

const departmentRouter = new OpenAPIHono();
const controller = new DepartmentController();

departmentRouter.get("/", protectRoute, controller.getDepartment);
departmentRouter.get("/:id", protectRoute, controller.getDepartmentById);
departmentRouter.delete("/:id", protectRoute, controller.deleteDepartment);
departmentRouter.post(
  "/",
  protectRoute,
  departmentValidator,
  async (c) => {
    const body = c.req.valid("json");
    return controller.createDepartment(c, body);
  }
);
departmentRouter.patch(
  "/:id",
  protectRoute,
  departmentValidator,
  async (c) => {
    const body = c.req.valid("json");
    return controller.updateDepartment(c, body);
  }
);

export default departmentRouter;