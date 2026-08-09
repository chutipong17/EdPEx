import { OpenAPIHono } from "@hono/zod-openapi";
import { DepartmentController } from "./department.controller";
import { departmentValidator } from "../../validator/validator";

const departmentRouter = new OpenAPIHono();
const controller = new DepartmentController();

departmentRouter.get("/", controller.getDepartment);
departmentRouter.get("/:id", controller.getDepartmentById);
departmentRouter.delete("/:id", controller.deleteDepartment);
departmentRouter.post(
  "/",
 
  departmentValidator,
  async (c) => {
    const body = c.req.valid("json");
    return controller.createDepartment(c, body);
  }
);
departmentRouter.patch(
  "/:id",
 
  departmentValidator,
  async (c) => {
    const body = c.req.valid("json");
    return controller.updateDepartment(c, body);
  }
);

export default departmentRouter;