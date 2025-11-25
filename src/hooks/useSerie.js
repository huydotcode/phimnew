import { useQuery } from "@tanstack/react-query";
import { getSerieMovies } from "../services/serieService";

/**
 * Hook để lấy danh sách phim bộ (series)
 * @param {number} page - Trang hiện tại
 */
export const useSerieMovies = (page) => {
  return useQuery({
    queryKey: ["serieMovies", page],
    queryFn: () => getSerieMovies(page),
    // keepPreviousData: true, // Giữ dữ liệu trang trước khi tải trang mới
    // staleTime: 5 * 60 * 1000, // Cache 5 phút
  });
};
