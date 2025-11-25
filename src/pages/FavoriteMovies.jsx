import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { db } from "../app/firebase";
import Icons from "../components/Icons";
import MovieCard from "../components/MovieCard";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthProvider";
import {
  getFavoritesByUser,
  removeFavorite,
} from "../services/favoriteService";

const FavoriteMovies = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [refresh, setRefresh] = useState(false); // để re-fetch

  const fetchFavorites = async () => {
    if (!user?.uid) return;
    const data = await getFavoritesByUser(user.uid);
    setFavorites(data);
  };

  useEffect(() => {
    fetchFavorites();
  }, [user, refresh]);

  // Xử lý bỏ yêu thích
  const handleUnfavorite = async (movieId) => {
    if (!movieId || !user?.uid) {
      toast.error("Thiếu movieId hoặc userId.");
      return;
    }

    try {
      const q = query(
        collection(db, "favorites"),
        where("user_id", "==", user.uid),
        where("movie_id", "==", movieId),
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("Không tìm thấy phim yêu thích để xoá.");
        return;
      }

      for (const docSnap of querySnapshot.docs) {
        await removeFavorite(docSnap.id);
      }

      toast.success("Đã bỏ yêu thích!");
      setRefresh((r) => !r);
      setFavorites((prev) => prev.filter((m) => m.movie_id !== movieId));
    } catch (error) {
      console.error("Lỗi khi bỏ yêu thích:", error);
      toast.error("Lỗi khi bỏ yêu thích!");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Phim Yêu Thích: <span className="text-secondary text-md">{favorites.length}</span></h1>

      {favorites.length === 0 ? (
        <p className="text-gray-400">Bạn chưa có phim yêu thích nào.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {favorites.map((movie) => (
            <div key={movie.id} className="relative">
              <MovieCard movie={movie.movie_data} />

              <Button
                className="absolute top-2 left-2 z-10 text-white p-2 rounded-full bg-[rgba(0,0,0,0.3)] hover:bg-primary"
                onClick={() => handleUnfavorite(movie._id)}
              >
                <Icons.Close className="text-xl text-white" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteMovies;
