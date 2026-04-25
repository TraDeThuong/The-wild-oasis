import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";

export function useCabins () {
    const {isLoading, data:cabins, error} = useQuery ({
        queryKey : ['cabins'],
        queryFn : getCabins,
        staleTime: 0
  })

  return {isLoading, error, cabins}
}