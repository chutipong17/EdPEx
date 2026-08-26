import { API_ENDPOINT } from "@/constant/enpoint";
import axiosInstance from "@/lib/axios";
import { createQueryKey, useGenericMutation, useGenericQuery } from "@/lib/react-query";


export const useGetTargetCondition = () => {
  const  { data, isLoading, error, refetch, } = useGenericQuery(["targetCondition"], () =>
    axiosInstance.get(`${API_ENDPOINT.TARGET_CONDITION.GET_ALL}`),

  );
  console.log("TARGET_CONDITION ==",data);
  
  return { data: data?.data, isLoading, error, refetch };
};

