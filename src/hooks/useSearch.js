import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "../services/searchService";

/**
 * Hook để tìm kiếm phim từ Firestore
 * @param {string} searchQuery - Từ khóa tìm kiếm
 * @param {number} page - Trang hiện tại
 */
export const useSearchMovies = (searchQuery, page) => {
  return useQuery({
    queryKey: ["searchMovies", searchQuery, page],
    queryFn: ({ queryKey }) => {
      const [, query, currentPage] = queryKey;
      return searchMovies(query, currentPage);
    },
    enabled: !!searchQuery, // Chỉ chạy khi có từ khóa tìm kiếm
    // keepPreviousData: true, // Giữ dữ liệu trang trước khi tải trang mới
    // staleTime: 5 * 60 * 1000, // Cache 5 phút
  });
};
