import { useQuery } from "@tanstack/react-query";
import { getSingleMovies } from "../services/singleService";

/**
 * Hook để lấy danh sách phim lẻ (single)
 * @param {number} page - Trang hiện tại
 */
export const useSingleMovies = (page) => {
  return useQuery({
    queryKey: ["singleMovies", page],
    queryFn: () => getSingleMovies(page),
  });
};
