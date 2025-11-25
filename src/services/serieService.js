import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  startAfter,
  limit,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../app/firebase";

/**
 * Lấy danh sách phim bộ (series) với phân trang
 * @param {number} page - Trang hiện tại
 * @param {object} lastVisible - Document cuối cùng của trang trước (nếu có)
 * @returns {Promise<{movies: Array, lastVisible: object}>}
 */
export const getSerieMovies = async (page, lastVisible = null) => {
  try {
    const pageSize = 10;

    let q = query(
      collection(db, "movies"),
      where("type", "==", "series"),
      orderBy("year", "desc"),
      limit(pageSize),
    );

    if (lastVisible) {
      q = query(
        collection(db, "movies"),
        where("type", "==", "series"),
        orderBy("year", "desc"),
        startAfter(lastVisible),
        limit(pageSize),
      );
    }

    const snapshot = await getDocs(q);

    // Lấy document cuối cùng để hỗ trợ phân trang
    const newLastVisible = snapshot.docs[snapshot.docs.length - 1];

    const snapshot2 = await getCountFromServer(q);
    const totalCount = snapshot2.data().count;

    const totalPages = Math.ceil(totalCount / pageSize);

    // Trả về danh sách phim và document cuối cùng
    return {
      movies: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      lastVisible: newLastVisible,
      totalPages: totalPages,
      totalCount: totalCount,
    };
  } catch (error) {
    console.error("Error fetching series movies:", error);
    throw error;
  }
};
