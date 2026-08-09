import { API_ENDPOINT } from "@/constant/enpoint";
import axiosInstance from "@/lib/axios";
import { createQueryKey, useGenericMutation, useGenericQuery } from "@/lib/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { DepartmentFormValues} from "@/lib/department-schema";
import { useRouter } from "next/navigation";
import { Department } from "@/lib/mock-departments";

export const useGetDepartments = () => {
  const  { data, isLoading, error, refetch, } = useGenericQuery(["departments"], () =>
    axiosInstance.get(`${API_ENDPOINT.DEPARTMENT.GET_ALL}`),

  );
  return { data: data?.data, isLoading, error, refetch };
};


export const useGetDepartmentById = (
  id: number,
): { data: Department | undefined; isLoading: boolean; error: any } => {
  const { data, isLoading, error } = useGenericQuery(["departments", id], () =>
    axiosInstance.get(`${API_ENDPOINT.DEPARTMENT.GET_BY_ID(id)}`),
  );

  return { data: data?.data, isLoading, error };
};

export const useCreateDepartment = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, error, isError, isPending } = useGenericMutation(
    async ({ body }: { body: DepartmentFormValues }) => {
      console.log("body API:", body); 
      const response = await axiosInstance.post(`${API_ENDPOINT.DEPARTMENT.CREATE}`, JSON.stringify(body));
      return response.data;
    },
    [createQueryKey("departments") as (string | number)[]],
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["departments"] });
        // router.push("/admin/manage/indicators-type");
      },
      onError: (error: any) => {
        queryClient.invalidateQueries({ queryKey: ["departments"] });
        // router.push("/admin/manage/indicators-type");
        console.error(error);
      },
    },
  );

  return { mutateAsync, error, isError, isPending };
};

export const useUpdateDepartment = () => {
  // const router = useRouter();
  const { mutateAsync, error, isError, isPending } = useGenericMutation(
    async ({ id, body }: { id: number; body: { departmentName: string; } }) => {
      const response = await axiosInstance.patch(
        `${API_ENDPOINT.DEPARTMENT.UPDATE(id)}`,
        JSON.stringify(body),
      );
      return response.data;
    },
    [createQueryKey("departments") as (string | number)[]],
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

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, error, isError, isPending } = useGenericMutation(
    async ({ id }: { id: number }) => {
      const response = await axiosInstance.delete(`${API_ENDPOINT.DEPARTMENT.DELETE(id)}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    [createQueryKey("departments") as (string | number)[]],
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["departments"] });
      },
      onError: (error: any) => {
        console.error(error);
      },
    },
  );

  return { mutateAsync, error, isError, isPending };
};