import {
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import mongoose from "mongoose";
import { db } from "../app/firebase";
import { moviesSort } from "../data/movies_sort";

// Lấy phim theo slug thông tin phim
export const getMovieBySlug = async (slug) => {
  try {
    const res = await fetch(`https://ophim1.com/phim/${slug}`);
    const data = await res.json();

    return data?.movie;
  } catch (error) {
    console.error("Error fetching movie by slug:", error);
    throw error;
  }
};

// Lấy danh sách tập phim theo slug gồm các tập
export const getEpsicodesBySlug = async (slug) => {
  try {
    const res = await fetch(`https://ophim1.com/phim/${slug}`);
    const data = await res.json();

    if (!data?.episodes || data?.episodes.length === 0) {
      console.error("No episodes found for this movie:", slug);
      return []; // Hoặc có thể ném lỗi tùy ý
    }

    return data?.episodes[0];
  } catch (error) {
    console.error("Error fetching movie by slug:", error);
    throw error;
  }
};

// Danh sách phim gợi ý từ những phim người dùng xem lấy từ những thể lọai phim đã xem
export const getSuggestionMovies = async (uid) => {
  try {
    const watchedMoviesRef = collection(db, "watched_movies");
    const qWatched = query(watchedMoviesRef, where("user_id", "==", uid));
    const snapshotWached = await getDocs(qWatched);
    const watchedMovies = snapshotWached.docs.map(
      (doc) => doc.data().movie_data,
    );

    const watchedMovieCategories = watchedMovies.map(
      (movie) => movie.category.map((cat) => cat.slug)[0],
    );

    const suggesstionMovies = await searchMovies({
      filters: {
        category: watchedMovieCategories,
        sort: "view",
      },
      page: 1,
      pageSize: 10,
    });

    return suggesstionMovies.movies;
  } catch (error) {
    console.error("Error fetching suggestion movies:", error);
    throw error;
  }
};

// Danh sách phim mới năm nay và có view nhiều nhất
export const getTopNewMovies = async (limitMovie = 10) => {
  const currentYear = new Date().getFullYear();
  try {
    const q = query(
      collection(db, "movies"),
      where("year", "==", currentYear),
      where("tmdb.vote_average", ">=", 7),
      where("view", ">=", 500),
      limit(limitMovie),
    );

    const snapshot = await getDocs(q);

    // Check if
    if (snapshot.empty || snapshot.size < limitMovie) {
      const q = query(
        collection(db, "movies"),
        where("year", "==", currentYear - 1),
        where("tmdb.vote_average", ">=", 7),
        where("view", ">=", 500),
        limit(limitMovie),
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching new movies:", error);
    throw error;
  }
};

// Top view nhiều nhất
export const getTopViewMovies = async () => {
  try {
    const q = query(
      collection(db, "movies"),
      orderBy("view", "desc"),
      limit(10),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching top movies:", error);
    throw error;
  }
};

// Phim lẻ mới ra
export const getNewSingleMovies = async () => {
  try {
    const q = query(
      collection(db, "movies"),
      where("type", "==", "single"),
      orderBy("created.time", "desc"),
      limit(10),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching new single movies:", error);
    throw error;
  }
};

// Phim bộ mới
export const getNewSeriesMovies = async () => {
  try {
    const q = query(
      collection(db, "movies"),
      where("type", "==", "series"),
      orderBy("created.time", "desc"),
      limit(10),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching new series movies:", error);
    throw error;
  }
};

// Phim trending
export const getTrendingMovies = async () => {
  try {
    const q = query(
      collection(db, "movies"),
      orderBy("view", "desc"),
      orderBy("created.time", "desc"),
      limit(10),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    throw error;
  }
};

export const getVietnameseMovies = async () => {
  try {
    const q = query(
      collection(db, "movies"),
      where("countrySlugs", "array-contains", "viet-nam"),
      limit(5),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching Vietnamese movies:", error);
    throw error;
  }
};

// Phim Hàn Quốc
export const getKoreanMovies = async () => {
  try {
    const q = query(
      collection(db, "movies"),
      where("countrySlugs", "array-contains", "han-quoc"),
      orderBy("created.time", "desc"),
      limit(10),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching Korean movies:", error);
    throw error;
  }
};

// Phim Mỹ
export const getAmericanMovies = async () => {
  try {
    const q = query(
      collection(db, "movies"),
      where("countrySlugs", "array-contains", "au-my"),
      orderBy("created.time", "desc"),
      limit(10),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching American movies:", error);
    throw error;
  }
};

// Lấy danh sách Saved Movies
export const getSavedMovies = async (uid) => {
  try {
    const snapshot = await getDocs(
      query(collection(db, "users", uid, "savedMovies")),
    );
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching saved movies:", error);
    throw error;
  }
};

// Lấy danh sách Favorite Movies
export const getFavoriteMovies = async (uid) => {
  try {
    const snapshot = await getDocs(
      query(collection(db, "users", uid, "favoriteMovies")),
    );
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching favorite movies:", error);
    throw error;
  }
};

// Lấy danh sách Watched Movies
export const getWatchedMovies = async (uid) => {
  try {
    const snapshot = await getDocs(
      query(collection(db, "users", uid, "watchedMovies")),
    );
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching watched movies:", error);
    throw error;
  }
};

// Thêm phim vào Saved
export const saveMovie = async (uid, movie) => {
  try {
    const movieRef = doc(db, "users", uid, "savedMovies", movie._id);
    await setDoc(movieRef, movie);
  } catch (error) {
    console.error("Error saving movie:", error);
    throw error;
  }
};

// Thêm phim vào Favorite
export const favoriteMovie = async (uid, movie) => {
  try {
    const movieRef = doc(db, "users", uid, "favoriteMovies", movie._id);
    await setDoc(movieRef, movie);
  } catch (error) {
    console.error("Error favoriting movie:", error);
    throw error;
  }
};

// Thêm phim vào Watched History
export const watchMovie = async (uid, movie) => {
  try {
    const movieRef = doc(db, "users", uid, "watchedMovies", movie._id);
    await setDoc(movieRef, movie);
  } catch (error) {
    console.error("Error watching movie:", error);
    throw error;
  }
};

// Lấy page đầu tiên
export const fetchMoviesFirstPage = async (pageSize = 10) => {
  const q = query(
    collection(db, "movies"),
    orderBy("year", "desc"),
    limit(pageSize),
  );
  const snapshot = await getDocs(q);
  const lastVisible = snapshot.docs[snapshot.docs.length - 1];

  return {
    movies: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    lastVisible,
  };
};

// Lấy trang kế tiếp (dựa vào lastVisible)
export const fetchNextPage = async (lastVisible, pageSize = 10) => {
  const q = query(
    collection(db, "movies"),
    orderBy("year", "desc"),
    startAfter(lastVisible),
    limit(pageSize),
  );
  const snapshot = await getDocs(q);
  const newLast = snapshot.docs[snapshot.docs.length - 1];

  return {
    movies: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    lastVisible: newLast,
  };
};

export const searchMovies = async ({
  searchTerm = "",
  filters = {},
  lastVisible = null,
  pageSize = 10,
}) => {
  try {
    const movieRef = collection(db, "movies");

    let constraints = [];

    // Tìm kiếm theo tên (dạng lowercase)
    if (searchTerm && searchTerm.trim() !== "") {
      const termLower = searchTerm.toLowerCase();
      constraints.push(
        where("name_lowercase", ">=", termLower),
        where("name_lowercase", "<=", termLower + "\uf8ff"),
      );
    }

    if (
      filters?.category &&
      filters?.country &&
      filters?.category.length > 0 &&
      filters?.country.length > 0
    ) {
      const categoryCountrySlugs = [...filters.category, ...filters.country];

      constraints.push(
        where(
          "categoryCountrySlugs",
          "array-contains-any",
          categoryCountrySlugs,
        ),
      );
    } else if (filters?.category && filters?.category.length > 0) {
      constraints.push(
        where("categorySlugs", "array-contains-any", filters.category),
      );
    } else if (filters?.country && filters?.country.length > 0) {
      constraints.push(
        where("countrySlugs", "array-contains-any", filters.country),
      );
    }

    // Lọc theo type
    if (filters?.type && filters?.type.length > 0) {
      constraints.push(where("type", "in", filters.type));
    }

    // Lọc theo year
    if (filters?.year && filters?.year.length > 0) {
      if (filters.year.includes("Cũ hơn")) {
        constraints.push(where("year", "<=", 2020));
        filters.year = filters.year.filter((year) => year !== "Cũ hơn");
      }
      if (filters.year.length > 0) {
        constraints.push(
          where(
            "year",
            "in",
            filters.year.map((year) => parseInt(year)),
          ),
        );
      }
    }

    /*
    {
    id: 3,
    name: "Lượt xem",
    slug: "view",
    sort_field: "view",
    sort_order: "desc",
  },
    */

    // Sort
    if (filters?.sort) {
      const sort =
        moviesSort.find((sort) => sort.slug === filters.sort) || moviesSort[0];

      constraints.push(orderBy(sort.sort_field, sort.sort_order));
    }

    let q = null;
    if (lastVisible) {
      q = query(
        movieRef,
        ...constraints,
        startAfter(lastVisible),
        limit(pageSize),
      );
    } else {
      q = query(movieRef, ...constraints, limit(pageSize));
    }

    const querySnapshot = await getDocs(q);

    let movies = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Lấy tổng số lượng phim
    const countQuery = query(collection(db, "movies"), ...constraints);
    const snapshot = await getCountFromServer(countQuery);
    const totalCount = snapshot.data().count;

    return {
      movies,
      lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1],
      totalMovies: totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  } catch (error) {
    console.error("Lỗi khi tìm kiếm phim từ Firestore:", error);
    return { movies: [], lastVisible: null, totalMovies: 0, totalPages: 0 };
  }
};

// Thêm phim mới vào Firestore
export const addMovie = async ({
  actor = [{ name: "Chưa cập nhật", slug: "chua-cap-nhat" }],
  category = [
    {
      name: "Chưa cập nhật",
      slug: "chua-cap-nhat",
    },
  ],
  categorySlugs = ["chua-cap-nhat"],
  chieurap = false,
  content = "",
  country = [
    {
      name: "Chưa cập nhật",
      slug: "chua-cap-nhat",
    },
  ],
  countrySlugs = ["chua-cap-nhat"],
  director = [
    {
      name: "Chưa cập nhật",
      slug: "chua-cap-nhat",
    },
  ],
  episode_current = "Chưa cập nhật",
  episode_total = 0,
  imdb = {
    id: "Chưa cập nhật",
  },
  is_copyright = false,
  lang = "Chưa cập nhật",
  name = "Chưa cập nhật",
  notify = "",
  origin_name = "",
  poster_url = "",
  quality = "",
  showtimes = "",
  slug = "chua-cap-nhat",

  // Chưa hoàn thành
  status = "uncompleted",
  sub_docquyen = false,
  thumb_url = "",
  time = "",
  tmdb = {
    id: "Chưa cập nhật",
    session: null,
    type: "movie",
    vote_average: 0,
    vote_count: 0,
  },
  trailer_url = "",
  type = "",
  view = 0,
  year = new Date().getFullYear(),
}) => {
  try {
    const newObjectId = new mongoose.Types.ObjectId();
    const movieId = newObjectId.toString(); // Chuyển đổi ObjectId thành chuỗi

    const movieRef = doc(db, "movies", movieId);

    await setDoc(movieRef, {
      _id: movieId,
      actor,
      category,
      categorySlugs,
      chieurap,
      content,
      country,
      countrySlugs,
      created: {
        time: Timestamp.fromDate(new Date()),
      },
      createdTime: Timestamp.fromDate(new Date()),
      director,
      episode_current,
      episode_total,
      imdb,
      is_copyright,
      lang,
      modified: {
        time: Timestamp.fromDate(new Date()),
        by: "admin",
      },
      name,
      name_lowercase: name.toLowerCase(), // Chuyển đổi tên thành chữ thường
      notify,
      origin_name,
      poster_url,
      quality,
      showtimes,
      slug,
      status,
      sub_docquyen,
      thumb_url,
      time,
      tmdb,
      trailer_url,
      type,
      view,
      year,
    });
  } catch (error) {
    console.error("Error adding movie:", error);
    throw error;
  }
};

export async function updateMovie(id, updatedData) {
  try {
    const movieRef = doc(db, "movies", id);

    await updateDoc(movieRef, {
      ...updatedData,
      name_lowercase: updatedData.name?.toLowerCase() || "", // đảm bảo đồng bộ field này
    });

    return true;
  } catch (error) {
    console.error("Lỗi khi cập nhật phim:", error);
    throw error;
  }
}

export const deleteMovie = async (id) => {
  try {
    const movieRef = doc(db, "movies", id);
    await deleteDoc(movieRef);
  } catch (error) {
    console.error("Lỗi khi xóa phim:", error);
    throw error;
  }
};

export const countMoviesWithoutCategoryCountrySlugs = async () => {
  try {
    const movieRef = collection(db, "movies");

    // Query các document không có field `categoryCountrySlugs`
    const q = query(movieRef, where("categoryCountrySlugs", "==", null));

    const snapshot = await getCountFromServer(q);
    const count = snapshot.data().count;

    return count;
  } catch (error) {
    console.error("Lỗi khi đếm phim:", error);
    throw error;
  }
};
