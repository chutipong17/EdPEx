import { API_ENDPOINT } from "@/constant/enpoint";
import axiosInstance from "@/lib/axios";
import { createQueryKey, useGenericMutation, useGenericQuery } from "@/lib/react-query";


export const useGetRoles = () => {
  const  { data, isLoading, error, refetch, } = useGenericQuery(["roles"], () =>
    axiosInstance.get(`${API_ENDPOINT.ROLE.GET_ALL}`),

  );
  return { data: data?.data, isLoading, error, refetch };
};

