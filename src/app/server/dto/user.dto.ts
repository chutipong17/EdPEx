import { z } from "zod";

const mobileNumberRegex = /^[0-9]{9,10}$/;

export const UserDto = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  departmentId: z.number().optional(),
  roleId: z.number().optional(),
  mobileNumber: z.string().regex(mobileNumberRegex).optional(),
  updatedBy: z.string().default("system"),
});

export type UserDto = z.infer<typeof UserDto>;
