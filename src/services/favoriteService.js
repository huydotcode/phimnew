import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../app/firebase";

// Thêm phim yêu thích
export const addFavorite = async ({ userId, movie }) => {
  const favRef = collection(db, "favorites");

  const q = query(
    favRef,
    where("user_id", "==", userId),
    where("movie_id", "==", movie._id),
  );
  const exists = await getDocs(q);

  if (!exists.empty) {
    return null;
  }

  const docRef = await addDoc(favRef, {
    user_id: userId,
    movie_id: movie._id,
    movie_data: movie, // lưu toàn bộ data để tiện hiển thị
    created_at: new Date(),
  });

  return {
    id: docRef.id, // ID tài liệu
    movie_id: movie._id, // ID phim
    user_id: userId, // ID người dùng
    movie_data: movie, // Dữ liệu phim
  };
};

// Lấy danh sách phim yêu thích theo user
export const getFavoritesByUser = async (userId) => {
  const favRef = collection(db, "favorites");
  const q = query(favRef, where("user_id", "==", userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id, // ID tài liệu
      movie_id: data.movie_id, // Cần để handleUnfavorite hoạt động
      user_id: data.user_id, // Có thể cần kiểm tra
      movie_data: data.movie_data, // Dữ liệu phim
    };
  });
};

export const removeFavorite = async (favoriteDocId) => {
  try {
    // Sử dụng đúng ID của tài liệu Firestore để xóa
    await deleteDoc(doc(db, "favorites", favoriteDocId));
  } catch (error) {
    console.error("Lỗi khi xóa phim khỏi danh sách yêu thích:", error);
  }
};
