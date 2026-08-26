"use client";

import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLES } from "@/types/user";
import { useGetDepartments } from "@/service/department/department";
import type { Department } from "@/types/department";
import { useGetRoles } from "@/service/role/role";
function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden="true">
      *
    </span>
  );
}

interface UserFormFieldsProps {
  // The form shapes for add/edit share these fields, so a loose type keeps this reusable.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  showPassword?: boolean;
}
// username
export function UserFormFields({
  form,
  showPassword = false,
  
}: UserFormFieldsProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const {
    data: departments,
    isLoading: departmentsLoading,
    error: departmentsError,
    refetch: mutate,
  } = useGetDepartments();

  const {
    data: roles,
    isLoading: rolesLoading,
    error: rolesError,
    refetch: mutateRoles,
  } = useGetRoles();
  return (
    <FieldGroup className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Field data-invalid={!!errors.department}>
        <FieldLabel htmlFor="department">
          หน่วยงานที่รับผิดชอบ <RequiredMark />
        </FieldLabel>
        <Controller
          control={control}
          name="department"
          render={({ field }) => {
            const selectedDepartment = departments?.data?.find(
              (dept: Department) => String(dept.id) === field.value,
            );

            return (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger
                  id="department"
                  className="w-full"
                  aria-invalid={!!errors.department}
                >
                  <SelectValue placeholder="เลือกหน่วยงาน">
                    {selectedDepartment?.departmentName}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {departments?.data?.map((dept: Department) => (
                      <SelectItem key={dept.id} value={String(dept.id)}>
                        {dept.departmentName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            );
          }}
        />
        <FieldError errors={[errors.department as { message?: string }]} />
      </Field>

      <Field data-invalid={!!errors.firstName || !!errors.lastName}>
        <FieldLabel>
          ผู้รับผิดชอบ <RequiredMark />
        </FieldLabel>

        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="ชื่อ"
            aria-invalid={!!errors.firstName}
            {...register("firstName")}
          />

          <Input
            placeholder="นามสกุล"
            aria-invalid={!!errors.lastName}
            {...register("lastName")}
          />
        </div>

        <FieldError
          errors={[
            errors.firstName as { message?: string },
            errors.lastName as { message?: string },
          ]}
        />
      </Field>

      <Field data-invalid={!!errors.role}>
        <FieldLabel htmlFor="role">
          กำหนดสิทธิ์เข้าใช้งานระบบ <RequiredMark />
        </FieldLabel>

        <Controller
          control={control}
          name="role"
          render={({ field }) => {
            const selectedRole = roles?.data?.find(
              (role: any) => String(role.id) === field.value,
            );

            return (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger
                  id="role"
                  className="w-full"
                  aria-invalid={!!errors.role}
                >
                  <SelectValue placeholder="เลือกสิทธิ์การใช้งาน">
                    {selectedRole?.roleNameTH}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {roles?.data?.map((role: any) => (
                      <SelectItem key={role.id} value={String(role.id)}>
                        {role.roleNameTH}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            );
          }}
        />

        <FieldError errors={[errors.role as { message?: string }]} />
      </Field>

      <Field data-invalid={!!errors.email}>
        <FieldLabel htmlFor="email">อีเมล</FieldLabel>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        <FieldError errors={[errors.email as { message?: string }]} />
      </Field>

      <Field data-invalid={!!errors.mobileNumber}>
        <FieldLabel htmlFor="mobileNumber">เบอร์โทรศัพท์</FieldLabel>
        <Input
          id="mobileNumber"
          inputMode="tel"
          placeholder="08xxxxxxxx"
          aria-invalid={!!errors.mobileNumber}
          {...register("mobileNumber")}
        />
        <FieldError errors={[errors.mobileNumber as { message?: string }]} />
      </Field>
      {showPassword  && (
        <Field data-invalid={!!errors.username}>
          <FieldLabel htmlFor="username">
            ชื่อผู้ใช้ <RequiredMark />
          </FieldLabel>
          <Input
            id="username"
            placeholder="username"
            autoComplete="username"
            aria-invalid={!!errors.username}
            {...register("username")}
          />
          <FieldError errors={[errors.username as { message?: string }]} />
        </Field>
      )}

      {showPassword && (
        <>
          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">
              รหัสผ่าน <RequiredMark />
            </FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="อย่างน้อย 8 ตัวอักษร"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <FieldError errors={[errors.password as { message?: string }]} />
          </Field>

          <Field data-invalid={!!errors.confirmPassword}>
            <FieldLabel htmlFor="confirmPassword">
              ยืนยันรหัสผ่าน <RequiredMark />
            </FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="กรอกรหัสผ่านอีกครั้ง"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
            <FieldError
              errors={[errors.confirmPassword as { message?: string }]}
            />
          </Field>
        </>
      )}
    </FieldGroup>
  );
}
