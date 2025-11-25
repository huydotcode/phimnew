import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../app/firebase";
import { moviesType } from "../data/movies_type";

export const getStatistics = async () => {
  const q = query(collection(db, "statistics"));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (data.length === 0) {
    return null;
  }

  return data[0];
};

export async function countMoviesByField(field) {
  const snapshot = await getDocs(collection(db, "movies"));
  const counts = {};

  snapshot.forEach((doc) => {
    const values = doc.data()[field] || [];
    values.forEach((val) => {
      const name = val.name || val; // handle both string or object
      counts[name] = (counts[name] || 0) + 1;
    });
  });

  const limit = 10; // Giới hạn số lượng kết quả trả về
  const sortedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const limitedCounts = sortedCounts.slice(0, limit);
  const othersCount = sortedCounts
    .slice(limit)
    .reduce((acc, [, count]) => acc + count, 0);
  const limitedCountsObj = Object.fromEntries(limitedCounts);
  limitedCountsObj["Khác"] = othersCount; // Thêm mục "Khác" với tổng số lượng còn lại

  const result = Object.entries(limitedCountsObj).map(([name, count]) => ({
    name,
    count,
  }));

  return result;
}

export async function getMovieDistribution() {
  const moviesRef = collection(db, "movies");

  // Đếm số phim theo năm
  const byYear = {};
  for (let year = 2000; year <= 2025; year++) {
    const yearQuery = query(moviesRef, where("year", "==", year));
    const snapshot = await getCountFromServer(yearQuery);
    const count = snapshot.data().count;
    if (count > 0) byYear[year] = count;
  }

  // Đếm số phim theo thể loại
  const byCategory = {};
  const categorySnapshot = await getDocs(moviesRef);
  categorySnapshot.forEach((doc) => {
    const categories = doc.data().category || [];
    categories.forEach((c) => {
      const name = c.name || c;
      byCategory[name] = (byCategory[name] || 0) + 1;
    });
  });

  // Đếm số phim theo ngôn ngữ
  const byLang = {};
  categorySnapshot.forEach((doc) => {
    const lang = doc.data().lang;
    if (lang) byLang[lang] = (byLang[lang] || 0) + 1;
  });

  return {
    byYear,
    byCategory,
    byLang,
  };
}

export async function getTopViewedMovies(topN = 10) {
  const q = query(
    collection(db, "movies"),
    orderBy("view", "desc"),
    limit(topN),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    view: doc.data().view || 0,
  }));
}

export async function countMoviesByYearRange(start, end) {
  const counts = {};

  for (let year = start; year <= end; year++) {
    const yearQuery = query(
      collection(db, "movies"),
      where("year", "==", year),
    );

    const snapshot = await getCountFromServer(yearQuery);
    counts[year] = snapshot.data().count;
  }

  return Object.entries(counts)
    .sort((a, b) => a[0] - b[0])
    .map(([year, count]) => ({ year: Number(year), count }));
}

export const getOverviewStats = async () => {
  // Đếm tổng số phim
  const moviesCountSnapshot = await getCountFromServer(
    collection(db, "movies"),
  );

  const totalMovies = moviesCountSnapshot.data().count;

  // Đếm tổng số người dùng
  const usersCountSnapshot = await getCountFromServer(collection(db, "users"));
  const totalUsers = usersCountSnapshot.data().count;

  // Tính tổng lượt xem (view) không cần đọc toàn bộ document
  let totalViews = 0;
  const moviesSnapshot = await getDocs(collection(db, "movies"));
  moviesSnapshot.forEach((doc) => {
    totalViews += doc.data().view || 0;
  });

  // Đọc 7 phim mới nhất
  const newMoviesSnapshot = await getDocs(
    query(collection(db, "movies"), orderBy("year", "desc"), limit(7)),
  );
  const newMoviesCount = newMoviesSnapshot.size;

  return [
    { title: "Tổng số phim", value: totalMovies },
    { title: "Tổng người dùng", value: totalUsers },
    { title: "Lượt xem", value: totalViews },
    { title: "Phim mới tuần qua", value: newMoviesCount },
  ];
};

// Thống kê các thể loại phim được xem nhiều nhất
export const getTopViewedCategories = async (topN) => {
  const snapshot = await getDocs(collection(db, "movies"));
  const counts = {};

  snapshot.forEach((doc) => {
    const categories = doc.data().category || [];
    const viewCount = doc.data().view || 0;

    categories.forEach((c) => {
      const name = c.name || c;
      counts[name] = (counts[name] || 0) + viewCount;
    });
  });

  // Sắp xếp và lấy top N thể loại
  const sortedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const limitedCounts = sortedCounts.slice(0, topN);
  const othersCount = sortedCounts
    .slice(topN)
    .reduce((acc, [, count]) => acc + count, 0);

  const limitedCountsObj = Object.fromEntries(limitedCounts);
  if (othersCount > 0) {
    limitedCountsObj["Khác"] = othersCount; // Thêm mục "Khác" với tổng số lượng còn lại
  }

  return Object.entries(limitedCountsObj).map(([name, count]) => ({
    name,
    count,
  }));
};

// Thống kê số phim theo loại phim movie.type: ["hoathinh", "series", "single", "tvshows"]
export const getCountMoviesByType = async () => {
  const counts = {};

  for (const type of moviesType) {
    const typeQuery = query(
      collection(db, "movies"),
      where("type", "==", type.slug),
    );
    const snapshot = await getCountFromServer(typeQuery);
    counts[type.name] = snapshot.data().count;
  }

  // Đếm các phim không thuộc loại đã xác định (Khác)
  const otherQuery = query(
    collection(db, "movies"),
    where(
      "type",
      "not-in",
      moviesType.map((t) => t.slug),
    ),
  );
  const otherSnapshot = await getCountFromServer(otherQuery);
  counts["Khác"] = otherSnapshot.data().count;

  return Object.entries(counts).map(([name, count]) => ({ name, count }));
};
