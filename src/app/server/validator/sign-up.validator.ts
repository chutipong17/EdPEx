import { zValidator } from '@hono/zod-validator';
import { SignUpDto } from "../dto/sign-up.dto";

export const signUpValidator = zValidator("json", SignUpDto, (result, c) => {
  if (!result.success) {
    return c.json(
      {
        success: false,
        message: "Validation Error",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
      400
    );
  }
});