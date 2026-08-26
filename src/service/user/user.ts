import { API_ENDPOINT } from "@/constant/enpoint";
import axiosInstance from "@/lib/axios";
import { createQueryKey, useGenericMutation, useGenericQuery } from "@/lib/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/user";
import { AddUserValues } from '@/lib/user-schema';
import { useRouter } from "next/navigation";

export const useGetAllUsers = () => {
  const  { data, isLoading, error, refetch, } = useGenericQuery(["user"], () =>
    axiosInstance.get(`${API_ENDPOINT.USER.GET_ALL}`),

  );
  return { data: data?.data, isLoading, error, refetch };
};


export const useGetUserById = (
  id: number,
): { data: User | undefined; isLoading: boolean; error: any } => {
  const { data, isLoading, error } = useGenericQuery(["user", id], () =>
    axiosInstance.get(`${API_ENDPOINT.USER.GET_BY_ID(id)}`),
  );

  return { data: data?.data, isLoading, error };
};
interface addUser  {
  department: number
  firstName: string
  lastName: string
  role: number,
  email: string,
  mobileNumber: string,
  username: string,
  password: string,
  confirmPassword: string,
}


export const useCreateUser = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, error, isError, isPending } = useGenericMutation(
    async ({ body }: { body:  addUser }) => {
    //   console.log("body API:", body); 
      const response = await axiosInstance.post(`${API_ENDPOINT.USER.CREATE}`, JSON.stringify(body));
      return response.data;
    },
    [createQueryKey("user") as (string | number)[]],
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user"] });
        // router.push("/admin/manage/indicators-type");
      },
      onError: (error: any) => {
        queryClient.invalidateQueries({ queryKey: ["user"] });
        // router.push("/admin/manage/indicators-type");
        console.error(error);
      },
    },
  );

  return { mutateAsync, error, isError, isPending };
};
interface editUser  {
  departmentId: number
  roleId: number
  firstName: string
  lastName: string
  email: string,
  mobileNumber: string,
  username: string,
}
export const useUpdateUser = () => {
  // const router = useRouter();
  const { mutateAsync, error, isError, isPending } = useGenericMutation(
    async ({ id, body }: { id: number; body: editUser }) => {
      const response = await axiosInstance.patch(
        `${API_ENDPOINT.USER.UPDATE(id)}`,
        JSON.stringify(body),
      );
      return response.data;
    },
    [createQueryKey("user") as (string | number)[]],
  );

  return { mutateAsync, error, isError, isPending };
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, error, isError, isPending } = useGenericMutation(
    async ({ id }: { id: number }) => {
      const response = await axiosInstance.delete(`${API_ENDPOINT.USER.DELETE(id)}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    [createQueryKey("user") as (string | number)[]],
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user"] });
      },
      onError: (error: any) => {
        console.error(error);
      },
    },
  );

  return { mutateAsync, error, isError, isPending };
};

export const useChangePassword = () => {
  const { mutateAsync, error, isError, isPending } = useGenericMutation(
    async ({ body }: {  body: { userId: number,password: string, confirmPassword: string } }) => {
      const response = await axiosInstance.post(
        `${API_ENDPOINT.AUTH.CHANGE_PASSWORD}`,
        JSON.stringify(body),
      );
      return response.data;
    },
    [createQueryKey("user") as (string | number)[]],
  );

  return { mutateAsync, error, isError, isPending };
};


export const useGetUsersByDepartment=(
  id: number,
): { data: User[]; isLoading: boolean; error: any } => {
  const { data, isLoading, error } = useGenericQuery(["userByDepartment", id], () =>
    axiosInstance.get(`${API_ENDPOINT.GET_USER_BY_DEPARTMENT.GET_USER_DEPARTMENT(id)}`),
  );
  console.log("API USER BY DEPARTMENT ====",data?.data?.data[0]);
  

  return {
    data: Array.isArray(data?.data?.data)
      ? data.data.data
      : [],
    isLoading,
    error,
  };
};



// export const useGetUsersByDepartment = (
//   departmentId: number,
// ) => {
//   return useGenericQuery<User[]>(
//     ["users-by-department", departmentId],
//     API_ENDPOINT.USER.GET_BY_DEPARTMENT(departmentId),
//     {
//       enabled: departmentId > 0,
//     },
//   );
// };