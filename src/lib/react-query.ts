import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";

export const queryClient = new QueryClient();

export function createQueryKey(...keys: (string | number | undefined)[]) {
  return keys.filter(Boolean);
}

export function useGenericQuery<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
  key: (string | number)[],
  queryFn: () => Promise<TQueryFnData>,
  options?: UseQueryOptions<TQueryFnData, TError, TData>,
) {
  return useQuery<TQueryFnData, TError, TData>({
    queryKey: key,
    queryFn,
    ...options,
  });
}

export function useGenericMutation<TData = unknown, TError = unknown, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  invalidateKeys: (string | number)[][] = [],
  options?: UseMutationOptions<TData, TError, TVariables>,
) {
  const queryClient = useQueryClient();
  return useMutation<TData, TError, TVariables>({
    mutationFn,
    onSuccess: (...args) => {
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

export { QueryClientProvider };
