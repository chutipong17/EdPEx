import { zValidator } from '@hono/zod-validator';
import { ChangePasswordDto } from '../dto/change-password.dto';

export const changePasswordValidator = zValidator("json", ChangePasswordDto, (result, c) => {
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