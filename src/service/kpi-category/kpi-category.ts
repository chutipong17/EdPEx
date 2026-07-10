import { API_ENDPOINT } from "@/constant/enpoint";
import axiosInstance from "@/lib/axios";
import { createQueryKey, useGenericMutation, useGenericQuery } from "@/lib/react-query";
import { useQueryClient } from "@tanstack/react-query";
// import { KpiCategory } from "@/types/kpi";

export type KpiCategory = {
  categoryName: string;
}

export const useGetKpiCategory = () => {
  const { data, isLoading, error } = useGenericQuery(["kpi-category"], () =>
    axiosInstance.get(`${API_ENDPOINT.KPI_CATEGORY.GET_ALL}`),
  );

  return { data, isLoading, error };
};

export const useGetKpiCategoryById = (
  id: number,
): { data: KpiCategory; isLoading: boolean; error: any } => {
  const { data, isLoading, error } = useGenericQuery(["kpi-category", id], () =>
    axiosInstance.get(`${API_ENDPOINT.KPI_CATEGORY.GET_BY_ID(id)}`),
  );

  return { data: data?.data, isLoading, error };
};

export const useCreateKpiCategory = () => {
//   const router = useRouter();
  const { mutateAsync, error, isError, isPending } = useGenericMutation(
    async ({ body }: { body: KpiCategory }) => {
      const response = await axiosInstance.post(`${API_ENDPOINT.KPI_CATEGORY.CREATE}`, JSON.stringify(body));
      return response.data;
    },
    [createQueryKey("kpi-category") as (string | number)[]],
    // {
    //   onSuccess: () => {
    //     router.push("/dashboard/kpi-categories");
    //   },
    //   onError: (error: any) => {
    //     console.error(error);
    //   },
    // },
  );

  return { mutateAsync, error, isError, isPending };
};

export const useUpdateKpiCategory = () => {
  // const router = useRouter();
  const { mutateAsync, error, isError, isPending } = useGenericMutation(
    async ({ id, body }: { id: number; body: KpiCategory }) => {
      const response = await axiosInstance.put(
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