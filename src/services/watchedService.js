import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../app/firebase";

// Thêm phim đã xem
export const addWatchedMovie = async ({ userId, movie, currentEpisode }) => {
  const docId = `${userId}_${movie._id}_${currentEpisode}`;
  const docRef = doc(db, "watched_movies", docId);

  await setDoc(docRef, {
    user_id: userId,
    movie_id: movie._id,
    watched_at: Timestamp.now(),
    movie_data: movie,
    episode: currentEpisode,
  });

  return {
    id: docRef.id,
    user_id: userId,
    movie_id: movie._id,
    watched_at: new Date().toISOString(),
    movie_data: movie,
    episode: currentEpisode,
  };
};

// Lấy danh sách phim đã xem
export const getWatchedMoviesByUser = async (userId) => {
  const watchedRef = collection(db, "watched_movies");
  const q = query(watchedRef, where("user_id", "==", userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    watched_at: doc.data().watched_at?.toDate().toISOString(),
  }));
};

// Xoá khỏi danh sách đã xem
export const removeWatchedMovie = async (docId) => {
  await deleteDoc(doc(db, "watched_movies", docId));
};
