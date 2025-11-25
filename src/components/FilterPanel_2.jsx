import { useState } from "react";
import { useNavigate } from "react-router";
import { moviesSort } from "../data/movies_sort";
import { moviesType } from "../data/movies_type";
import { useAllCategories } from "../hooks/useCategory";
import { useAllCountries } from "../hooks/useCountry";

// Constants
const MOVIE_YEARS = ["2025", "2024", "2023", "2022", "2021", "2020", "Cũ hơn"];
const MOVIE_LANGUAGES = ["Vietsub", "Thuyết Minh"];
const DEFAULT_FILTERS = {
  type: [],
  country: [],
  category: [],
  year: [],
  lang: [],
  sort: "Mới nhất",
};

// Reusable Components
export const FilterSection = ({ title, items, selected, onChange, onClear, isSort = false }) => (
  <div className="flex items-start mb-3">
    <h3 className="text-white font-semibold mb-1 min-w-[120px]">{title}:</h3>
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item.id || item.slug || item}
          className={`px-4 ${isSort
            ? selected === item.slug
              ? "text-yellow-500"
              : "text-white"
            : selected.includes(item.slug)
              ? "text-yellow-500"
              : "text-white"
            }`}
          onClick={() => {
            onChange(isSort ? item.slug || item : item.slug || item)
          }}
        >
          {item.name || item}
        </button>
      ))}
      {!isSort && (
        <button
          className="bg-gray-500 rounded-full px-4 text-secondary"
          onClick={onClear}
        >
          Xóa
        </button>
      )}
    </div>
  </div >
);


const FilterPanel_2 = ({
  filters,
  showFilters,
  searchTerm = "",
  setShowFilters,
  handleApplyFilters,
  hasTypeFilter = true,
  hasCategoryFilter = true,
  hasCountryFilter = true,
}) => {
  const [currentFilters, setCurrentFilters] = useState(filters);
  const { data: countries } = useAllCountries({ enable: true });
  const { data: categories } = useAllCategories({ enable: true });
  const navigate = useNavigate();

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setCurrentFilters((prev) => ({
      ...prev,
      [key]: key === "sort" ? value : prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  };

  // Clear specific filter
  const clearFilter = (key) => {
    setCurrentFilters((prev) => ({
      ...prev,
      [key]: key === "sort" ? "Mới nhất" : [],
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setCurrentFilters(DEFAULT_FILTERS);
  };

  // Apply filters and update URL
  const applyFilters = () => {
    handleApplyFilters(currentFilters);
    const params = new URLSearchParams({ q: searchTerm });

    Object.entries(currentFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(","));
      } else if (key === "sort" && value) {
        params.set(key, value);
      }
    });

    navigate(`?${params.toString()}`);
    setShowFilters(false);
  };

  return (
    <>
      <div className="mb-1">
        <button
          className={`flex items-center gap-2 bg-background transition-all duration-300 text-white px-4 py-2 rounded-md ${showFilters ? "bg-background" : "bg-secondary"
            }`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <span>🔍</span> Bộ lọc
        </button>
      </div>

      <div
        className={`w-full mb-4 bg-background rounded-xl bg-opacity-80 z-50 transition-all overflow-y-auto duration-300 ${showFilters ? "p-4 max-h-[80vh] md:max-h-[600px]" : "max-h-0"
          }`}
      >
        <div className="space-y-4">
          {hasCountryFilter && (
            <FilterSection
              title="Quốc gia"
              items={countries || []}
              selected={currentFilters.country}
              onChange={(value) => handleFilterChange("country", value)}
              onClear={() => clearFilter("country")}
            />
          )}

          {hasCategoryFilter && (
            <FilterSection
              title="Thể loại"
              items={categories || []}
              selected={currentFilters.category}
              onChange={(value) => handleFilterChange("category", value)}
              onClear={() => clearFilter("category")}
            />
          )}

          <FilterSection
            title="Năm"
            items={MOVIE_YEARS}
            selected={currentFilters.year}
            onChange={(value) => handleFilterChange("year", value)}
            onClear={() => clearFilter("year")}
          />

          <FilterSection
            title="Ngôn ngữ"
            items={MOVIE_LANGUAGES}
            selected={currentFilters.lang}
            onChange={(value) => handleFilterChange("lang", value)}
            onClear={() => clearFilter("lang")}
          />

          {hasTypeFilter && (
            <FilterSection
              title="Loại phim"
              items={moviesType} // Giả định moviesType được định nghĩa ở ngoài
              selected={currentFilters.type}
              onChange={(value) => handleFilterChange("type", value)}
              onClear={() => clearFilter("type")}
            />
          )}

          <FilterSection
            title="Sắp xếp"
            items={moviesSort} // Giả định moviesSort được định nghĩa ở ngoài
            selected={currentFilters.sort}
            onChange={(value) => handleFilterChange("sort", value)}
            isSort
          />
        </div>

        <div className="flex gap-4 mt-4">
          <button
            className="px-4 py-2 bg-primary text-white rounded-md"
            onClick={applyFilters}
          >
            Lọc kết quả
          </button>
          <button
            className="px-4 py-2 bg-secondary text-white rounded-md"
            onClick={clearAllFilters}
          >
            Xóa tất cả
          </button>
          <button
            className="px-4 py-2 bg-secondary text-white rounded-md"
            onClick={() => setShowFilters(false)}
          >
            Đóng
          </button>
        </div>
      </div>
    </>
  );
};


export default FilterPanel_2;
