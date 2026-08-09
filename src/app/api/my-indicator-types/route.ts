import { NextResponse } from "next/server";
// import {mockIndicatorTypes} from '@/lib/mock-indicator-types'
// import {indicatorTypeSchema} from '@/lib/indicator-type-schema'
import axiosInstance from "@/lib/axios";
// import { useGenericQuery } from "@/lib/react-query";
import { API_ENDPOINT } from "@/constant/enpoint";


export async function GET() {
    try {
    const { data } = await axiosInstance.get(
      API_ENDPOINT.KPI_CATEGORY.GET_ALL
    );
console.log("data API route:", data);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message ?? "โหลดข้อมูลไม่สำเร็จ" },
      { status: error.response?.status ?? 500 }
    );
  }
}

export async function POST(request: Request) {
   try {
    const body = await request.json();

    const { data } = await axiosInstance.post(
      API_ENDPOINT.KPI_CATEGORY.CREATE,
      body
    );

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message ?? "เพิ่มข้อมูลไม่สำเร็จ" },
      { status: error.response?.status ?? 500 }
    );
  }
}
