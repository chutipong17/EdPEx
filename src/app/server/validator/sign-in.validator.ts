import { zValidator } from '@hono/zod-validator';
import { SignInDto } from '../dto/sign-in.dto';

export const signInValidator = zValidator("json", SignInDto, (result, c) => {
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