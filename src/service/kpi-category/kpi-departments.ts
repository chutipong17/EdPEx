import { API_ENDPOINT } from "@/constant/enpoint";
import axiosInstance from "@/lib/axios";
import { createQueryKey, useGenericMutation, useGenericQuery } from "@/lib/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { KpiCategory } from "@/types/kpi";
import { DepartmentFormValues} from "@/lib/department-schema";
import { useRouter } from "next/navigation";

export const useGetKpiCategory = () => {
  const  { data, isLoading, error, refetch, } = useGenericQuery(["kpi-category"], () =>
    axiosInstance.get(`${API_ENDPOINT.KPI_CATEGORY.GET_ALL}`),

  );
  return { data: data?.data, isLoading, error, refetch };
};


export const useGetKpiCategoryById = (
  id: number,
): { data: KpiCategory | undefined; isLoading: boolean; error: any } => {
  const { data, isLoading, error } = useGenericQuery(["kpi-category", id], () =>
    axiosInstance.get(`${API_ENDPOINT.KPI_CATEGORY.GET_BY_ID(id)}`),
  );

  return { data: data?.data, isLoading, error };
};

export const useCreateKpiCategory = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, error, isError, isPending } = useGenericMutation(
    async ({ body }: { body: IndicatorTypeFormValues }) => {
      console.log("body API:", body); 
      const response = await axiosInstance.post(`${API_ENDPOINT.KPI_CATEGORY.CREATE}`, JSON.stringify(body));
      return response.data;
    },
    [createQueryKey("kpi-category") as (string | number)[]],
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["kpi-category"] });
        // router.push("/admin/manage/indicators-type");
      },
      onError: (error: any) => {
        queryClient.invalidateQueries({ queryKey: ["kpi-category"] });
        // router.push("/admin/manage/indicators-type");
        console.error(error);
      },
    },
  );

  return { mutateAsync, error, isError, isPending };
};

export const useUpdateKpiCategory = () => {
  // const router = useRouter();
  const { mutateAsync, error, isError, isPending } = useGenericMutation(
    async ({ id, body }: { id: number; body: { categoryName: string; } }) => {
      const response = await axiosInstance.patch(
        `${API_ENDPOINT.KPI_CATEGORY.UPDATE(id)}`,
        JSON.stringify(body),
      );
      return response.data;
    },
    [createQueryKey("kpi-category") as (string | number)[]],
    // {
    //   onSuccess: () => {
    //     router.push("/dashboard/activities");
    //   },
    //   onError: (error: any) => {
    //     console.error(error);
    //   },
    // },
  );

  return { mutateAsync, error, isError, isPending };
};

export const useDeleteKpiCategory = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, error, isError, isPending } = useGenericMutation(
    async ({ id }: { id: number }) => {
      const response = await axiosInstance.delete(`${API_ENDPOINT.KPI_CATEGORY.DELETE(id)}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    [createQueryKey("kpi-category") as (string | number)[]],
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["kpi-category"] });
      },
      onError: (error: any) => {
        console.error(error);
      },
    },
  );

  return { mutateAsync, error, isError, isPending };
};