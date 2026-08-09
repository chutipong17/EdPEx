import { NextResponse } from "next/server";
import { mockIndicatorTypes } from "@/lib/mock-indicator-types";
import { indicatorTypeSchema } from "@/lib/indicator-type-schema";
import { API_ENDPOINT } from "@/constant/enpoint";
import axiosInstance from "@/lib/axios";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const indicatorTypeId = Number(id);

    const { data } = await axiosInstance.patch(
      API_ENDPOINT.KPI_CATEGORY.UPDATE(indicatorTypeId),
      body,
    );
    console.log("=========================================");
    console.log("data API route PATCH:", API_ENDPOINT.KPI_CATEGORY.UPDATE(indicatorTypeId),);
    console.log("=========================================");

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message ?? "แก้ไขข้อมูลไม่สำเร็จ" },
      { status: error.response?.status ?? 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const { data } = await axiosInstance.delete(
      API_ENDPOINT.KPI_CATEGORY.DELETE(Number(id))
    );

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message ?? "ลบข้อมูลไม่สำเร็จ" },
      { status: error.response?.status ?? 500 }
    );
  }
}
