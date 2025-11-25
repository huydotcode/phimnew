import { useQuery } from "@tanstack/react-query";
import {
  getAllCountries,
  getMoviesByCountry,
} from "../services/countryService";

export const useAllCountries = ({ enable = true }) => {
  return useQuery({
    queryKey: ["allCountries"],
    queryFn: getAllCountries,
    enabled: enable,
    // staleTime: 5 * 60 * 1000, // cache 5 phút
    initialData: [],
  });
};

/**
 * Hook để lấy danh sách phim theo quốc gia
 * @param {string} countrySlug - Slug của quốc gia
 * @param {number} page - Trang hiện tại
 */
export const useCountryMovies = (countrySlug, page) => {
  return useQuery({
    queryKey: ["moviesByCountry", countrySlug, page],
    queryFn: () => getMoviesByCountry(countrySlug, page),
    // keepPreviousData: true, // Giữ dữ liệu trang trước khi tải trang mới
    // staleTime: 5 * 60 * 1000, // Cache 5 phút
  });
};
