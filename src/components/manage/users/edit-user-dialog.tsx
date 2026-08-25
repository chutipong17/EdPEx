"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserFormFields } from "./user-form";
import { editUserSchema, type EditUserValues } from "@/lib/user-schema";
import type { User } from "@/types/user";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSubmit: (values: EditUserValues) => void;
}

export function EditUserDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
}: EditUserDialogProps) {
  const form = useForm<EditUserValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      departmentId: user?.departmentId || 0,
      firstName: "",
      lastName: "",
      roleId: user?.roleId || 0,
      email: "",
      mobileNumber: "",
      username: "",
      department:user?.department || "",
      role:user?.roleNameTh || "",
    },
  });

  useEffect(() => {
    if (open && user) {
      form.reset({
        departmentId: user.departmentId,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
        email: user.email,
        mobileNumber: user.mobileNumber,
        username: user.username,
        department:user.departmentName || "",
        role:user.roleNameTh || "",
      });
    }
  }, [open, user, form]);


  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values);
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[95vw] gap-0 overflow-y-auto p-0 sm:max-w-[800px]">
        <DialogHeader className="border-b p-6">
          <DialogTitle className="text-lg font-semibold">
            แก้ไขผู้ใช้งาน
          </DialogTitle>
          <DialogDescription>
            ปรับปรุงข้อมูลของ{" "}
            {user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : "ผู้ใช้งาน"}{" "}
            ตามต้องการ
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <UserFormFields form={form} />
          </div>

          <DialogFooter className="mx-0 mb-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              ย้อนกลับ
            </Button>
            <Button type="submit">บันทึกข้อมูล</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
