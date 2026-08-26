import { API_ENDPOINT } from "@/constant/enpoint";
import axiosInstance from "@/lib/axios";
import { createQueryKey, useGenericMutation, useGenericQuery } from "@/lib/react-query";


export const useGetMonth= () => {
  const  { data, isLoading, error, refetch, } = useGenericQuery(["month"], () =>
    axiosInstance.get(`${API_ENDPOINT.MONTH.GET_ALL}`),

  );
  return { data: data?.data, isLoading, error, refetch };
};
