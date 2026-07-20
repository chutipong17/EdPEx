import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { SignInDto } from '../dto/sign-in.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { DepartmentDto } from '../dto/department.dto';

export const createValidator = <T>(schema: z.ZodType<T>) =>
  zValidator("json", schema, (result, c) => {
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
  }
);

export const signInValidator = createValidator(SignInDto);
export const signUpValidator = createValidator(SignUpDto);
export const changePasswordValidator = createValidator(ChangePasswordDto);
export const departmentValidator = createValidator(DepartmentDto);