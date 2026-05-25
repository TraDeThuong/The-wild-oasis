import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";
import { getGuests } from "../../services/apiGuests";
import { useEffect, useMemo } from "react";

export function useGuests() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // FILTER
  const filterValue = searchParams.get("status");
  const filter = useMemo(
    () =>
      !filterValue || filterValue === "all"
        ? null
        : { field: "status", value: filterValue },
    [filterValue],
  );

  // SORT
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  const sortBy = useMemo(() => {
    const [field, direction] = sortByRaw.split("-");
    return { field, direction };
  }, [sortByRaw]);

  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  // QUERY
  const { isLoading, data, error } = useQuery({
    queryKey: ["guests", filter, sortBy, page],
    queryFn: () => getGuests({ filter, sortBy, page }),
    staleTime: 0,
  });

  const guests = data?.data ?? [];
  const count = data?.count ?? 0;

  const pageCount = Math.ceil(count / PAGE_SIZE);

  // PREFETCH (FIXED)
  useEffect(() => {
    if (page < pageCount) {
      queryClient.prefetchQuery({
        queryKey: ["guests", filter, sortBy, page + 1],
        queryFn: () => getGuests({ filter, sortBy, page: page + 1 }),
      });
    }

    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["guests", filter, sortBy, page - 1],
        queryFn: () => getGuests({ filter, sortBy, page: page - 1 }),
      });
    }
  }, [page, pageCount, filter, sortBy, queryClient]);

  return { isLoading, error, guests, count };
}
