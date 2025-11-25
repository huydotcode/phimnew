import { Modal } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FilterPanel from "../../components/FilterPanel";
import { useAllCategories } from "../../hooks/useCategory";
import { useAllCountries } from "../../hooks/useCountry";
import {
  addMovie,
  deleteMovie,
  fetchMoviesFirstPage,
  searchMovies,
  updateMovie,
} from "../../services/movieService";

import { Select } from "antd";
import { IoAddOutline } from "react-icons/io5";
import { toast } from "sonner";
import { moviesLang } from "../../data/movies_lang";
import { moviesType } from "../../data/movies_type";
import Icons from "../../components/Icons";

const PAGE_SIZE = 10;

const ModalAdd = ({ show, setShow, loadFirstPage }) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });
  const { data: categories } = useAllCategories({ enable: true });
  const { data: countries } = useAllCountries({ enable: true });

  const onSubmit = async (data) => {
    try {
      const categorySlugs = data.category.map((c) => {
        return categories.find((category) => category.name === c)?.slug;
      });
      const countrySlugs = data.country.map((c) => {
        return countries.find((country) => country.name === c)?.slug;
      });

      const movieData = {
        name: data.name,
        year: data.year,
        lang: data.lang,
        type: data.type,
        poster_url: data.poster_url,
        trailer_url: data.trailer_url,
        thumb_url: data.thumb_url,
        content: data.content,
        categorySlugs,
        countrySlugs,
        category: categories.filter((c) => {
          return categorySlugs.includes(c.slug);
        }),
        country: countries.filter((c) => {
          return countrySlugs.includes(c.slug);
        }),
      };

      await addMovie(movieData);
      toast("Thêm phim thành công");
    } catch (error) {
      console.error("Error adding movie:", error);
      toast.error("Thêm phim thất bại");
    } finally {
      setShow(false); // Đóng modal sau khi thêm
      reset(); // Reset form
      loadFirstPage(); // Tải lại danh sách phim
    }
  };

  if (!show) return null;

  return (
    <Modal
      title="Thêm phim"
      open={show}
      onCancel={() => setShow(false)}
      footer={null}
      centered
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        <div className="flex w-full justify-between gap-4">
          {/* Tên phim */}
          <div className="mb-4 flex-1">
            <label className="block text-white mb-2">Tên phim</label>
            <input
              type="text"
              {...register("name", {
                required: "Tên phim là bắt buộc",
              })}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Năm */}
          <div className="mb-4 w-1/4">
            <label className="block text-white mb-2">Năm</label>
            <input
              type="text"
              {...register("year", {
                required: "Năm là bắt buộc",
                pattern: {
                  value: /^\d{4}$/,
                  message: "Năm phải là 4 chữ số",
                },
              })}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            {errors.year && (
              <span className="text-red-500 text-sm">
                {errors.year.message}
              </span>
            )}
          </div>
        </div>

        {/* Thể loại */}
        <div className="mb-4">
          <label className="block text-white mb-2">Thể loại</label>
          <Controller
            control={control}
            name="category"
            rules={{ required: "Thể loại là bắt buộc" }}
            render={({ field }) => (
              <Select
                key={field.value}
                className="bg-black px-3 py-2 border rounded"
                mode="tags"
                style={{ width: "100%" }}
                placeholder="Chọn hoặc nhập thể loại"
                {...field}
                options={categories.map((category) => ({
                  label: category.name,
                  value: category.name,
                }))}
                showSearch
              />
            )}
          />
        </div>

        {/* Quốc gia */}
        <div className="mb-4">
          <label className="block text-white mb-2">Quốc gia</label>
          <Controller
            control={control}
            rules={{ required: "Thể loại là bắt buộc" }}
            name="country"
            render={({ field }) => (
              <Select
                key={field.value}
                className="bg-black px-3 py-2 border rounded"
                mode="tags"
                style={{ width: "100%" }}
                placeholder="Chọn hoặc nhập quốc gia"
                {...field}
                options={countries.map((country) => ({
                  label: country.name,
                  value: country.name,
                }))}
                showSearch
              />
            )}
          />
        </div>

        <div className="flex w-full justify-between gap-4">
          {/* Ngôn ngữ */}
          <div className="mb-4 flex-1">
            <label className="block text-white mb-2">Ngôn ngữ</label>
            <select
              type="text"
              {...register("lang", {
                required: "Ngôn ngữ là bắt buộc",
              })}
              className="border border-gray-300 rounded px-3 py-2 w-full bg-black"
            >
              {moviesLang.map((lang) => (
                <option key={lang.slug} value={lang.slug}>
                  {lang.name}
                </option>
              ))}
            </select>

            {errors.lang && (
              <span className="text-red-500 text-sm">
                {errors.lang.message}
              </span>
            )}
          </div>

          {/* Loại phim */}
          <div className="mb-4 flex-1">
            <label className="block text-white mb-2">Loại phim</label>
            <select
              type="text"
              {...register("type", {
                required: "Loại phim là bắt buộc",
              })}
              className="border border-gray-300 rounded px-3 py-2 w-full bg-black"
            >
              {moviesType.map((type) => (
                <option key={type.slug} value={type.slug}>
                  {type.name}
                </option>
              ))}
            </select>

            {errors.type && (
              <span className="text-red-500 text-sm">
                {errors.type.message}
              </span>
            )}
          </div>
        </div>

        {/* Poster URL */}
        <div className="mb-4">
          <label className="block text-white mb-2">Poster URL</label>
          <input
            type="text"
            {...register("poster_url", {
              required: "Poster URL là bắt buộc",
            })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />

          {errors.poster_url && (
            <span className="text-red-500 text-sm">
              {errors.poster_url.message}
            </span>
          )}
        </div>

        {/* Thumb URL */}
        <div className="mb-4">
          <label className="block text-white mb-2">Thumb URL</label>
          <input
            type="text"
            {...register("thumb_url", {
              required: "Thumb URL là bắt buộc",
            })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />

          {errors.thumb_url && (
            <span className="text-red-500 text-sm">
              {errors.poster_url.message}
            </span>
          )}
        </div>

        {/* Trailer URL */}
        <div className="mb-4">
          <label className="block text-white mb-2">Trailer URL</label>
          <input
            type="text"
            {...register("trailer_url")}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />

          {errors.trailer_url && (
            <span className="text-red-500 text-sm">
              {errors.trailer_url.message}
            </span>
          )}
        </div>

        {/* Nội dung */}
        <div className="mb-4">
          <label className="block text-white mb-2">Nội dung</label>
          <textarea
            {...register("content", {
              required: "Nội dung là bắt buộc",
              minLength: {
                value: 10,
                message: "Nội dung phải có ít nhất 10 ký tự",
              },
            })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            rows={4}
          ></textarea>
        </div>

        <div className="flex justify-center gap-2">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded w-1/2"
          >
            Lưu
          </button>

          <button
            type="button"
            className="bg-secondary text-white px-4 py-2 rounded"
            onClick={() => {
              reset(); // Reset form
              setShow(false); // Đóng modal
            }}
          >
            Hủy
          </button>
        </div>
      </form>
    </Modal>
  );
};

const ModalEdit = ({ show, setShow, movie, loadFirstPage }) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { data: categories } = useAllCategories({ enable: true });
  const { data: countries } = useAllCountries({ enable: true });

  useEffect(() => {
    if (movie) {
      reset({
        ...movie,
        category: movie.category,
        country: movie.country,
        trailer_url: movie.trailer_url,
        poster_url: movie.poster_url,
        thumb_url: movie.thumb_url,
        lang: movie.lang,
        type: movie.type,
        name: movie.name,
        year: movie.year,
        content: movie.content,
      });
    }
  }, [movie, reset]);

  const onSubmit = async (data) => {
    try {
      const categorySlugs = data.category.map((c) => {
        return categories.find((category) => category.name === c)?.slug;
      });
      const countrySlugs = data.country.map((c) => {
        return countries.find((country) => country.name === c)?.slug;
      });

      const movieData = {
        id: movie.id,
        name: data.name,
        year: data.year,
        lang: data.lang,
        type: data.type,
        poster_url: data.poster_url,
        trailer_url: data.trailer_url,
        thumb_url: data.thumb_url,
        content: data.content,
        categorySlugs,
        countrySlugs,
        category: categories.filter((c) => {
          return categorySlugs.includes(c.slug);
        }),
        country: countries.filter((c) => {
          return countrySlugs.includes(c.slug);
        }),
      };

      await updateMovie(movieData.id, movieData);
      toast("Cập nhật phim thành công");
    } catch (error) {
      console.error("Error updating movie:", error);
      toast.error("Cập nhật phim thất bại");
    } finally {
      setShow(false); // Đóng modal sau khi cập nhật
      reset(); // Reset form
      loadFirstPage(); // Tải lại danh sách phim
    }
  };

  if (!show || !movie) return null;

  return (
    <Modal
      centered
      title="Chỉnh sửa phim"
      open={show}
      onCancel={() => setShow(false)}
      footer={null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        <div className="flex w-full justify-between gap-4">
          {/* Tên phim */}
          <div className="mb-4 flex-1">
            <label className="block text-white mb-2">Tên phim</label>
            <input
              type="text"
              {...register("name", {
                required: "Tên phim là bắt buộc",
              })}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Năm */}
          <div className="mb-4 w-1/4">
            <label className="block text-white mb-2">Năm</label>
            <input
              type="text"
              {...register("year", {
                required: "Năm là bắt buộc",
                pattern: {
                  value: /^\d{4}$/,
                  message: "Năm phải là 4 chữ số",
                },
              })}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            {errors.year && (
              <span className="text-red-500 text-sm">
                {errors.year.message}
              </span>
            )}
          </div>
        </div>

        {/* Thể loại */}
        <div className="mb-4">
          <label className="block text-white mb-2">Thể loại</label>
          <Controller
            control={control}
            name="category"
            rules={{ required: "Thể loại là bắt buộc" }}
            render={({ field }) => (
              <Select
                key={field.value}
                className="bg-black px-3 py-2 border rounded"
                mode="tags"
                style={{ width: "100%" }}
                placeholder="Chọn hoặc nhập thể loại"
                {...field}
                options={categories.map((category) => ({
                  label: category.name,
                  value: category.name,
                }))}
                showSearch
              />
            )}
          />
        </div>

        {/* Quốc gia */}
        <div className="mb-4">
          <label className="block text-white mb-2">Quốc gia</label>
          <Controller
            control={control}
            rules={{ required: "Thể loại là bắt buộc" }}
            name="country"
            render={({ field }) => (
              <Select
                key={field.value}
                className="bg-black px-3 py-2 border rounded"
                mode="tags"
                style={{ width: "100%" }}
                placeholder="Chọn hoặc nhập quốc gia"
                {...field}
                options={countries.map((country) => ({
                  label: country.name,
                  value: country.name,
                }))}
                showSearch
              />
            )}
          />
        </div>

        <div className="flex w-full justify-between gap-4">
          {/* Ngôn ngữ */}
          <div className="mb-4 flex-1">
            <label className="block text-white mb-2">Ngôn ngữ</label>
            <select
              type="text"
              {...register("lang", {
                required: "Ngôn ngữ là bắt buộc",
              })}
              className="border border-gray-300 rounded px-3 py-2 w-full bg-black"
            >
              {moviesLang.map((lang) => (
                <option key={lang.slug} value={lang.name}>
                  {lang.name}
                </option>
              ))}
            </select>

            {errors.lang && (
              <span className="text-red-500 text-sm">
                {errors.lang.message}
              </span>
            )}
          </div>

          {/* Loại phim */}
          <div className="mb-4 flex-1">
            <label className="block text-white mb-2">Loại phim</label>
            <select
              type="text"
              {...register("type", {
                required: "Loại phim là bắt buộc",
              })}
              className="border border-gray-300 rounded px-3 py-2 w-full bg-black"
            >
              {moviesType.map((type) => (
                <option key={type.slug} value={type.slug}>
                  {type.name}
                </option>
              ))}
            </select>

            {errors.type && (
              <span className="text-red-500 text-sm">
                {errors.type.message}
              </span>
            )}
          </div>
        </div>

        {/* Poster URL */}
        <div className="mb-4">
          <label className="block text-white mb-2">Poster URL</label>
          <input
            type="text"
            {...register("poster_url", {
              required: "Poster URL là bắt buộc",
            })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />

          {errors.poster_url && (
            <span className="text-red-500 text-sm">
              {errors.poster_url.message}
            </span>
          )}
        </div>

        {/* Thumb URL */}
        <div className="mb-4">
          <label className="block text-white mb-2">Thumb URL</label>
          <input
            type="text"
            {...register("thumb_url", {
              required: "Thumb URL là bắt buộc",
            })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          {errors.thumb_url && (
            <span className="text-red-500 text-sm">
              {errors.thumb_url.message}
            </span>
          )}
        </div>

        {/* Trailer URL */}
        <div className="mb-4">
          <label className="block text-white mb-2">Trailer URL</label>
          <input
            type="text"
            {...register("trailer_url")}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />

          {errors.trailer_url && (
            <span className="text-red-500 text-sm">
              {errors.trailer_url.message}
            </span>
          )}
        </div>

        {/* Nội dung */}
        <div className="mb-4">
          <label className="block text-white mb-2">Nội dung</label>
          <textarea
            {...register("content", {
              required: "Nội dung là bắt buộc",
              minLength: {
                value: 10,
                message: "Nội dung phải có ít nhất 10 ký tự",
              },
            })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            rows={4}
          ></textarea>
        </div>

        <div className="flex justify-center gap-2">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded w-1/2"
          >
            Lưu
          </button>

          <button
            type="button"
            className="bg-secondary text-white px-4 py-2 rounded"
            onClick={() => {
              reset(); // Reset form
              setShow(false); // Đóng modal
            }}
          >
            Hủy
          </button>
        </div>
      </form>
    </Modal>
  );
};

const ModalDelete = ({ show, setShow, movie, loadFirstPage }) => {
  const onDelete = async () => {
    try {
      await deleteMovie(movie);
      toast("Xóa phim thành công");
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast.error("Xóa phim thất bại");
    } finally {
      setShow(false); // Đóng modal sau khi xóa
      loadFirstPage(); // Tải lại danh sách phim
    }
  };

  if (!show || !movie) return null;

  return (
    <Modal
      centered
      title="Xóa phim"
      open={show}
      onCancel={() => setShow(false)}
      footer={null}
    >
      <div className="p-4">
        <p>Bạn có chắc chắn muốn xóa phim này không?</p>
        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-4 py-2 rounded mt-4"
        >
          Xóa
        </button>
      </div>
    </Modal>
  );
};

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Thay đổi từ 0 thành 1
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    country: [], // Lưu nhiều quốc gia
    category: [],
    year: [],
    lang: [],
    type: [],
    sort: "Mới nhất", // Sắp xếp
  });

  const { data: categories } = useAllCategories({ enable: true });
  const { data: countries } = useAllCountries({ enable: true });
  const [showFilter, setShowFilter] = useState(false);

  const [sort, setSort] = useState("Mới nhất"); // Sắp xếp mặc định

  const [showAddMovie, setShowAddMovie] = useState(false);

  const [editState, setEditState] = useState({
    id: null,
    name: "",
    category: [],
    country: [],
    year: "",
    lang: "",
    type: "",
    poster_url: "",
    trailer_url: "",
    thumb_url: "",
    content: "",
    tmdb: "",

    show: false,
  });
  const [deleteState, setDeleteState] = useState({
    id: null,
    show: false,
  });

  const loadFirstPage = useCallback(async () => {
    setLoading(true);
    const res = await fetchMoviesFirstPage(PAGE_SIZE, filters);
    setMovies(res.movies);
    setLastVisible(res.lastVisible);
    setHasMore(res.movies.length === PAGE_SIZE);
    setLoading(false);
  }, [filters]);

  const loadMore = async () => {
    if (!hasMore || !lastVisible) return;
    setLoading(true);
    const res = await searchMovies({
      filters: filters,
      page: page + 1,
      searchTerm,
      lastVisible: lastVisible,
    });
    setPage((prev) => prev + 1); // Tăng trang khi tải thêm
    setMovies((prev) => [...prev, ...res.movies]);
    setLastVisible(res.lastVisible);
    setHasMore(res.movies.length === PAGE_SIZE);
    setLoading(false);
  };

  const handleSearch = async () => {
    setLoading(true);
    const res = await searchMovies({
      filters: filters,
      page: 1,
      searchTerm,
      lastVisible,
    });
    setMovies(res.movies);
    setHasMore(res.movies.length === PAGE_SIZE && res.movies.length > 0);
    setLastVisible(res.lastVisible);
    setPage(1); // Reset trang về 1 khi tìm kiếm
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleApplyFilter = async () => {
    const filtersAll = {
      country: filters.country.map((c) => {
        return countries.find((country) => country.name === c)?.slug;
      }),
      category: filters.category.map((c) => {
        return categories.find((category) => category.name === c)?.slug;
      }),
      year: filters.year,
      lang: filters.lang.map((l) => l.value),
      type: filters.type.map((t) => t.value),
      sort: filters.sort,
    };

    const data = await searchMovies({
      filters: filtersAll,
      page,
      searchTerm,
    });

    setMovies(data.movies);
    setHasMore(data.movies.length === PAGE_SIZE && data.movies.length > 0);
    setLastVisible(data.lastVisible);
    setLoading(false);
    setPage(1); // Reset trang về 1 khi áp dụng bộ lọc
  };

  const handleEditMovie = (movie) => {
    setEditState({
      id: movie._id,
      name: movie.name,
      category: movie.category.map((c) => c.name),
      country: movie.country.map((c) => c.name),
      year: movie.year,
      lang: movie.lang,
      type: movie.type,
      poster_url: movie.poster_url,
      thumb_url: movie.thumb_url,
      trailer_url: movie.trailer_url,
      tmdb: movie.tmdb,
      content: movie.content,

      show: true,
    });
  };

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  return (
    <>
      <ModalAdd
        show={showAddMovie}
        setShow={setShowAddMovie}
        loadFirstPage={loadFirstPage}
      />

      <ModalEdit
        movie={editState}
        show={editState.show}
        setShow={(setShow) => {
          setEditState((prev) => ({ ...prev, show: setShow }));
        }}
        loadFirstPage={loadFirstPage}
      />

      <ModalDelete
        movie={deleteState.id}
        show={deleteState.show}
        setShow={(setShow) => {
          setDeleteState((prev) => ({ ...prev, show: setShow }));
        }}
        loadFirstPage={loadFirstPage}
      />

      <div className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold">Danh sách phim</h2>

          <button
            className="bg-primary text-white px-4 py-1 rounded flex items-center gap-2 hover:opacity-80"
            onClick={() => setShowAddMovie((prev) => !prev)}
          >
            <IoAddOutline className="w-6 h-6" />{" "}
            <span className="hidden md:block">Thêm phim</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <label className="text-white mr-2 text-sm">Tìm kiếm:</label>

          <input
            type="text"
            placeholder="Tìm kiếm tên phim..."
            value={searchTerm}
            onChange={handleInputChange}
            className=" px-3 py-2 text-sm rounded bg-foreground w-64"
          />
          <button
            onClick={handleSearch}
            className="bg-secondary text-sm text-white px-8 py-2 rounded h-full"
          >
            <Icons.Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className={`text-sm text-white px-8 py-2 rounded ${showFilter ? "bg-primary" : "bg-secondary"
              }`}
          >
            <Icons.Filter className="w-4 h-4" />
          </button>

          {showFilter && (
            <FilterPanel
              filters={filters}
              handleFilter={handleApplyFilter}
              setFilters={setFilters}
              setShowFilters={setShowFilter}
            />
          )}

          {/* Sort */}
          <div className="flex items-center ml-auto">
            <label className="text-white text-sm">
              <Icons.Sort className="w-5 h-5" />
            </label>

            <select
              value={filters.sort}
              onChange={(e) => {
                setSort(e.target.value);
              }}
              className="bg-black text-sm text-white px-3 py-2 rounded"
            >
              <option value="Mới nhất">Mới nhất</option>
              <option value="Cũ nhất">Cũ nhất</option>
              <option value="Xem nhiều nhất">Xem nhiều nhất</option>
              <option value="Xem ít nhất">Xem ít nhất</option>
              <option value="TMDB cao nhất">TMDB cao nhất</option>
              <option value="TMDB thấp nhất">TMDB thấp nhất</option>
              <option value="Tên A-Z">Tên A-Z</option>
              <option value="Tên Z-A">Tên Z-A</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-900 text-sm text-left text-white">
            <thead className="bg-primary">
              <tr>
                <th className="px-4 py-2 border border-gray-900 hidden xl:table-cell">
                  Poster
                </th>
                <th className="px-4 py-2 border border-gray-900">Tên phim</th>
                <th className="px-4 py-2 border border-gray-900">Thể loại</th>
                <th className="px-4 py-2 border border-gray-900 hidden xl:table-cell">
                  Quốc gia
                </th>
                <th className="px-4 py-2 border border-gray-900">Năm</th>
                <th className="px-4 py-2 border border-gray-900 hidden xl:table-cell">
                  Lượt xem
                </th>
                <th className="px-4 py-2 border border-gray-900 hidden xl:table-cell">
                  TMDB
                </th>
                <th className="px-4 py-2 border border-gray-900">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {movies
                .sort((a, b) => {
                  if (sort === "Mới nhất") {
                    return new Date(b.year) - new Date(a.year);
                  } else if (sort === "Cũ nhất") {
                    return new Date(a.year) - new Date(b.year);
                  } else if (sort === "Xem nhiều nhất") {
                    return b.view - a.view;
                  } else if (sort === "Xem ít nhất") {
                    return a.view - b.view;
                  } else if (sort === "TMDB cao nhất") {
                    return b.tmdb.vote_average - a.tmdb.vote_average;
                  } else if (sort === "TMDB thấp nhất") {
                    return a.tmdb.vote_average - b.tmdb.vote_average;
                  } else if (sort === "Tên A-Z") {
                    return a.name.localeCompare(b.name);
                  } else if (sort === "Tên Z-A") {
                    return b.name.localeCompare(a.name);
                  } else {
                    return 0;
                  }
                })
                .map((movie) => (
                  <tr
                    key={movie.id}
                    className="hover:bg-gray-700 border border-gray-800"
                  >
                    <td className="px-4 py-2 hidden xl:table-cell">
                      <img src={movie.poster_url} alt={movie.name} width={50} />
                    </td>
                    <td className="px-4 py-2 max-w-[200px]">{movie.name}</td>
                    <td className="px-4 py-1 max-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                        {movie.categorySlugs?.map((c) => {
                          const category = categories.find(
                            (category) => category.slug === c,
                          );

                          return (
                            <span
                              key={category?.id}
                              className="bg-secondary text-white text-xs px-2 py-1 rounded mr-1"
                            >
                              {category?.name}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-2 max-w-[200px] hidden xl:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {movie.countrySlugs.map((c) => {
                          const country = countries.find(
                            (country) => country.slug === c,
                          );

                          if (!country) {
                            return null;
                          }

                          return (
                            <span
                              key={country?.id}
                              className="bg-green-600 text-white text-xs px-2 py-1 rounded mr-1"
                            >
                              {country?.name}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-2">{movie.year}</td>
                    <td className="px-4 py-2 hidden xl:table-cell">
                      {movie.view}
                    </td>
                    <td className="px-4 py-2 hidden xl:table-cell">
                      {movie.tmdb.vote_average.toFixed(1)}
                    </td>
                    <td className="px-4 py-2 flex items-center">
                      <div>
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
                          onClick={() => handleEditMovie(movie)}
                        >
                          Sửa
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => {
                            setDeleteState({
                              id: movie._id,
                              show: true,
                            });
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-4">
          {hasMore ? (
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-primary hover:opacity-50 text-sm text-white px-4 py-2 rounded"
            >
              {loading ? "Đang tải..." : "Tải thêm"}
            </button>
          ) : (
            <p className="text-gray-400 italic">Đã tải hết phim.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default MovieList;
