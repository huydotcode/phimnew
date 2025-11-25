import { useQuery } from "@tanstack/react-query";
import { getAllMovies } from "../services/FilterService";

/**
 * Hook để lấy tất cả phim từ Firestore
 * @param {number} page - Trang hiện tại
 */
export const useAllMovies = (page) => {
  return useQuery({
    queryKey: ["allMovies", page],
    queryFn: () => getAllMovies(page),
    // keepPreviousData: true, // Giữ dữ liệu trang trước khi tải trang mới
    // staleTime: 5 * 60 * 1000, // Cache 5 phút
  });
};
