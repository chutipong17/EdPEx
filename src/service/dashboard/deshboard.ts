import { API_ENDPOINT } from "@/constant/enpoint";
import axiosInstance from "@/lib/axios";
import { createQueryKey, useGenericMutation, useGenericQuery } from "@/lib/react-query";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface DashboardFormValues {
  year: number | null;
  kpiCategoryId: number | null;
  departmentId: number | null;
}
export const useGetDashboard = () => {
 const router = useRouter();
   const queryClient = useQueryClient();
   const { mutateAsync, error, isError, isPending } = useGenericMutation(
     async ({ body }: { body: DashboardFormValues }) => {
       console.log("body API:", body); 
       const response = await axiosInstance.post(`${API_ENDPOINT.DASHBOARD.GET_ALL}`, JSON.stringify(body));
       return response.data;
     },
     [createQueryKey("dashboard") as (string | number)[]],
     {
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["dashboard"] });
         // router.push("/admin/manage/indicators-type");
       },
       onError: (error: any) => {
         queryClient.invalidateQueries({ queryKey: ["dashboard"] });
         // router.push("/admin/manage/indicators-type");
         console.error(error);
       },
     },
   );
 
   return { mutateAsync, error, isError, isPending };
};

