import { API_ENDPOINT } from "@/constant/enpoint";
import axiosInstance from "@/lib/axios";
import { createQueryKey, useGenericMutation, useGenericQuery } from "@/lib/react-query";


export const useGetFrequency= () => {
  const  { data, isLoading, error, refetch, } = useGenericQuery(["frequency"], () =>
    axiosInstance.get(`${API_ENDPOINT.FREQUENCY.GET_ALL}`),

  );
  return { data: data?.data, isLoading, error, refetch };
};
