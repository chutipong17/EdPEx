import { API_ENDPOINT } from "@/constant/enpoint";
import axiosInstance from "@/lib/axios";
import { createQueryKey, useGenericMutation, useGenericQuery } from "@/lib/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { Indicator} from "@/types/indicators";
import { IndicatorFormValues } from "@/lib/indicator-schema";
import { useRouter } from "next/navigation";

export const useGetKpi = () => {
  const  { data, isLoading, error, refetch, } = useGenericQuery(["kpi"], () =>
    axiosInstance.get(`${API_ENDPOINT.KPI.GET_ALL}`),

  );
  console.log("KPI API ==",data)
  return { data: data?.data, isLoading, error, refetch };
};

export const useGetKpiById = (
  id: number,
): { data: Indicator | undefined; isLoading: boolean; error: any } => {
  const { data, isLoading, error } = useGenericQuery(["kpi", id], () =>
    axiosInstance.get(`${API_ENDPOINT.KPI.GET_BY_ID(id)}`),
  );

  return { data: data?.data, isLoading, error };
};
interface kpiComparisonData {
  seq: number;
  name: string;
  result: string;
}

interface IndicatorFormValue {
  kpiCategoryId: number;
  departmentId: number;
  monthOfDeliveryId: number;
  frequencyId: number;
  targetConditionId: number;
  userId: number;
  kpiCode: string;
  kpiName: string;
  targetValue: number;
  year: number;
  unit: string;
  kpiComparison: kpiComparisonData[];
}
export const useCreateKpi= () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, error, isError, isPending } = useGenericMutation(
    async ({ body }: { body: IndicatorFormValue }) => {
      console.log("body API:", body); 
      const response = await axiosInstance.post(`${API_ENDPOINT.KPI.CREATE}`, JSON.stringify(body));
      return response.data;
    },
    [createQueryKey("kpi") as (string | number)[]],
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["kpi"] });
        router.push("/admin/manage/indicators")
      },
      onError: (error: any) => {
        queryClient.invalidateQueries({ queryKey: ["kpi"] });
        console.error(error);
      },
    },
  );

  return { mutateAsync, error, isError, isPending };
};

// export const useUpdateKpi = () => {
//   // const router = useRouter();
//   const { mutateAsync, error, isError, isPending } = useGenericMutation(
//     async ({ id, body }: { id: number; body: IndicatorFormValue }) => {
//       const response = await axiosInstance.patch(
//         `${API_ENDPOINT.KPI.UPDATE(id)}`,
//         JSON.stringify(body),
//       );
//       return response.data;
//     },
//     [createQueryKey("kpi") as (string | number)[]],
  
//   );

//   return { mutateAsync, error, isError, isPending };
// };

export const useUpdateKpi = () => {
  const {
    mutateAsync,
    error,
    isError,
    isPending,
  } = useGenericMutation(
    async ({
      id,
      body,
    }: {
      id: number;
      body: IndicatorFormValue;
    }) => {
      const response =
        await axiosInstance.patch(
          `${API_ENDPOINT.KPI.UPDATE(id)}`,
          body,
        );

      return response.data;
    },
    [
      createQueryKey(
        "kpi",
      ) as (string | number)[],
    ],
  );

  return {
    mutateAsync,
    error,
    isError,
    isPending,
  };
};

export const useDeleteKpi = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, error, isError, isPending } = useGenericMutation(
    async ({ id }: { id: number }) => {
      const response = await axiosInstance.delete(`${API_ENDPOINT.KPI.DELETE(id)}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    [createQueryKey("kpi") as (string | number)[]],
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["kpi"] });
      },
      onError: (error: any) => {
        console.error(error);
      },
    },
  );

  return { mutateAsync, error, isError, isPending };
};

export interface Submission {
  description: string;
  actualValue: number;
}
export const useUpdateKpiSubmission = () => {
  const { mutateAsync, error, isError, isPending } =
    useGenericMutation(
      async ({
        id,
        body,
      }: {
        id: number;
        body: Submission;
      }) => {
        const response = await axiosInstance.patch(
          API_ENDPOINT.KPI_SUBMISSION.UPDATE(id),
          body,
        );

        return response.data;
      },
      [createQueryKey("kpi") as (string | number)[]],
    );

  return {
    mutateAsync,
    error,
    isError,
    isPending,
  };
};