import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  GetAllStatesApiLocationsStatesGetResponse,
  PaginationMetaModel,
} from "../sdk/out";
import { getAllStatesApiLocationsStatesGet } from "../sdk/out";

const QUERY_KEY = "states";

type UseQueryStatesParams = {
  countryId?: number;
  search?: string;
  limit?: number;
  currentPage?: number;
};

export const useQueryStates = (params: UseQueryStatesParams = {}) => {
  const { countryId, search, limit, currentPage } = params;

  return useInfiniteQuery<GetAllStatesApiLocationsStatesGetResponse>({
    queryKey: [
      QUERY_KEY,
      {
        countryId: countryId ?? null,
        search: search ?? null,
        limit: limit ?? null,
      },
    ],
    initialPageParam: currentPage ?? 1,
    queryFn: async ({ pageParam }) => {
      try {
        const { data } = await getAllStatesApiLocationsStatesGet({
          query: {
            country_id: countryId ?? null,
            search: search ?? null,
            limit: limit ?? null,
            current_page: Number(pageParam) || 1,
          },
          throwOnError: true,
        });
        return data;
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Failed to load states";
        toast.error(message);
        throw e;
      }
    },
    getNextPageParam: lastPage => {
      const meta = lastPage?.meta as PaginationMetaModel | undefined;
      if (!meta) return undefined;
      return meta.current_page < meta.total_page
        ? meta.current_page + 1
        : undefined;
    },
    getPreviousPageParam: firstPage => {
      const meta = firstPage?.meta as PaginationMetaModel | undefined;
      if (!meta) return undefined;
      return meta.current_page > 1 ? meta.current_page - 1 : undefined;
    },
  });
};
