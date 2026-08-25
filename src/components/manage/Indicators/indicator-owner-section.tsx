"use client";

import { Controller, useFormContext } from "react-hook-form";

import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FormSection } from "./form-section";
import { RequiredMark } from "./required-mark";

import type { IndicatorFormValues } from "@/lib/indicator-schema";

import { useGetDepartments } from "@/service/department/department";
import { useGetUsersByDepartment } from "@/service/user/user";

/* =====================================================
   Types
===================================================== */

interface Department {
  id: number;
  departmentName: string;
  departmentCode?: string | null;
  organizationId?: number;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

/* =====================================================
   Component
===================================================== */

export function IndicatorOwnerSection() {
  const {
    control,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<IndicatorFormValues>();

  /* =====================================================
     GET DEPARTMENTS
  ===================================================== */

  const {
    data: departmentsResponse,
    isLoading: departmentsLoading,
    error: departmentsError,
  } = useGetDepartments();

  /* =====================================================
     NORMALIZE DEPARTMENT RESPONSE
  ===================================================== */

  const departmentList: Department[] =
    Array.isArray(departmentsResponse)
      ? (departmentsResponse as Department[])
      : Array.isArray(
            (departmentsResponse as { data?: unknown })
              ?.data,
        )
        ? (
            (departmentsResponse as {
              data: Department[];
            }).data
          )
        : [];

  /* =====================================================
     SELECTED DEPARTMENT
  ===================================================== */

  const selectedDepartmentId =
    watch("department");

  const departmentId =
    selectedDepartmentId
      ? Number(selectedDepartmentId)
      : 0;

  /* =====================================================
     GET USERS BY DEPARTMENT
  ===================================================== */

 const {
  data: userList,
  isLoading: usersLoading,
  error: usersError,
} = useGetUsersByDepartment(departmentId);

  /* =====================================================
     NORMALIZE USER RESPONSE
  ===================================================== */

  // const userList: User[] = Array.isArray(usersResponse)
  // ? usersResponse
  // : [];

  console.log(
    "DEPARTMENT RESPONSE ===",
    departmentsResponse,
  );

  console.log(
    "DEPARTMENT LIST ===",
    departmentList,
  );

  console.log(
    "DEPARTMENT ID ===",
    departmentId,
  );

  // console.log(
  //   "USER RESPONSE ===",
  //   usersResponse,
  // );

  console.log(
    "USER LIST ===",
    userList,
  );

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <FormSection
      step={4}
      title="กำหนดผู้รับผิดชอบ"
      description="ระบุหน่วยงานและผู้รับผิดชอบตัวชี้วัด"
      className="grid grid-cols-1 gap-5 md:grid-cols-2"
    >
      {/* =================================================
          DEPARTMENT
      ================================================= */}

      <Controller
        control={control}
        name="department"
        render={({ field }) => {
          const selectedDepartment =
            departmentList.find(
              (dept: Department) =>
                String(dept.id) ===
                String(field.value),
            );

          return (
            <Field
              data-invalid={
                !!errors.department
              }
            >
              <FieldLabel htmlFor="department">
                หน่วยงานรับผิดชอบ{" "}
                <RequiredMark />
              </FieldLabel>

              <Select
                value={field.value ?? ""}
                onValueChange={(
                  value,
                ) => {
                  const newValue =
                    value ?? "";

                  field.onChange(
                    newValue,
                  );

                  /*
                   * เปลี่ยน Department
                   * ให้ล้าง Owner
                   */
                  setValue(
                    "owner",
                    "",
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    },
                  );

                  console.log(
                    "Selected Department ID:",
                    newValue,
                  );
                }}
              >
                <SelectTrigger
                  id="department"
                  className="w-full"
                  aria-invalid={
                    !!errors.department
                  }
                >
                  <SelectValue
                    placeholder="เลือกหน่วยงาน"
                  >
                    {selectedDepartment
                      ? selectedDepartment.departmentName
                      : "เลือกหน่วยงาน"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {departmentsLoading ? (
                      <SelectItem
                        value="loading"
                        disabled
                      >
                        กำลังโหลดหน่วยงาน...
                      </SelectItem>
                    ) : departmentsError ? (
                      <SelectItem
                        value="error"
                        disabled
                      >
                        ไม่สามารถโหลดหน่วยงานได้
                      </SelectItem>
                    ) : departmentList.length ===
                      0 ? (
                      <SelectItem
                        value="empty"
                        disabled
                      >
                        ไม่พบข้อมูลหน่วยงาน
                      </SelectItem>
                    ) : (
                      departmentList.map(
                        (
                          dept: Department,
                        ) => (
                          <SelectItem
                            key={dept.id}
                            value={String(
                              dept.id,
                            )}
                          >
                            {dept.departmentName}
                          </SelectItem>
                        ),
                      )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <FieldError
                errors={[
                  errors.department,
                ]}
              />
            </Field>
          );
        }}
      />

      {/* =================================================
          OWNER
      ================================================= */}

     <Controller
  control={control}
  name="owner"
  render={({ field }) => {
    const selectedUser = userList.find(
      (user: User) =>
        String(user.id) === String(field.value),
    );

    return (
      <Field data-invalid={!!errors.owner}>
        <FieldLabel htmlFor="owner">
          ผู้รับผิดชอบ <RequiredMark />
        </FieldLabel>

        <Select
          value={field.value ? String(field.value) : ""}
          disabled={
            departmentId === 0 || usersLoading
          }
          onValueChange={(value) => {
            field.onChange(value);

            // เลือกแล้วเอา error สีแดงออกทันที
            if (value) {
              clearErrors("owner");
            }
          }}
        >
          <SelectTrigger
            id="owner"
            className="w-full"
            aria-invalid={!!errors.owner}
          >
            <SelectValue
              placeholder={
                departmentId === 0
                  ? "กรุณาเลือกหน่วยงานก่อน"
                  : usersLoading
                    ? "กำลังโหลดผู้รับผิดชอบ..."
                    : "เลือกผู้รับผิดชอบ"
              }
            >
              {selectedUser
                ? `${selectedUser.firstName} ${selectedUser.lastName}`
                : undefined}
            </SelectValue>
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {usersLoading ? (
                <SelectItem
                  value="loading"
                  disabled
                >
                  กำลังโหลดผู้รับผิดชอบ...
                </SelectItem>
              ) : usersError ? (
                <SelectItem
                  value="error"
                  disabled
                >
                  ไม่สามารถโหลดผู้รับผิดชอบได้
                </SelectItem>
              ) : departmentId === 0 ? (
                <SelectItem
                  value="no-department"
                  disabled
                >
                  กรุณาเลือกหน่วยงานก่อน
                </SelectItem>
              ) : userList.length === 0 ? (
                <SelectItem
                  value="empty"
                  disabled
                >
                  ไม่พบผู้รับผิดชอบ
                </SelectItem>
              ) : (
                userList.map((user: User) => (
                  <SelectItem
                    key={user.id}
                    value={String(user.id)}
                  >
                    {user.firstName} {user.lastName}
                  </SelectItem>
                ))
              )}
            </SelectGroup>
          </SelectContent>
        </Select>

        <FieldError errors={[errors.owner]} />
      </Field>
    );
  }}
/>
    </FormSection>
  );
}