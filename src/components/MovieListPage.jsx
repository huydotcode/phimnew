import { Pagination } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { useSearchMovies } from "../hooks/useSearchMovie";
import FilterPanel_2 from "./FilterPanel_2";
import MovieList from "./MovieList";

const MovieListPage = ({
  title,
  defaultFilters,
  searchTerm = "",
  hasTypeFilter = true,
  hasCategoryFilter = true,
  hasCountryFilter = true,
  pageSize = 20,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [lastVisibleCache, setLastVisibleCache] = useState({});

  const navigate = useNavigate();
  useScrollToTop();

  const {
    data: { movies, lastVisible, totalPages },
    isLoading,
    isFetching,
  } = useSearchMovies({
    enable: true,
    filters,
    page: currentPage,
    lastVisible: lastVisibleCache[currentPage] || null,
    pageSize,
    searchTerm,
  });

  useEffect(() => {
    if (lastVisible) {
      setLastVisibleCache((prev) => ({
        ...prev,
        [currentPage]: lastVisible,
      }));
    }
  }, [lastVisible, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    setLastVisibleCache({});
  }, [filters, searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const params = new URLSearchParams(window.location.search);
    params.set("page", page);
    navigate({
      pathname: window.location.pathname,
      search: params.toString(),
    });
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>

      <FilterPanel_2
        showFilters={showFilters}
        filters={filters}
        searchTerm={searchTerm}
        handleApplyFilters={handleApplyFilters}
        setShowFilters={setShowFilters}
        hasTypeFilter={hasTypeFilter}
        hasCategoryFilter={hasCategoryFilter}
        hasCountryFilter={hasCountryFilter}
      />


      {/* Danh sách phim */}
      <MovieList
        movies={movies}
        isLoading={isLoading}
        isFetching={isFetching}
      />

      {/* Phân trang */}
      {!isLoading && movies.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            className="dark-pagination"
            current={currentPage}
            pageSize={pageSize}
            total={totalPages * pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
            showTotal={(total) => `Tổng ${total} phim`}
          />
        </div>
      )}
    </div>
  );
};

export default MovieListPage;
