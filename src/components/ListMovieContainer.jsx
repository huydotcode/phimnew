import { useEffect } from "react";
import Loading from "./Loading";
import MovieCard from "./MovieCard";

const ListMovieContainer = ({
  wrapperRef,
  title,
  movies = [],
  isLoading = true,
  error = null,
}) => {
  useEffect(() => {
    if (error) {
      console.error("Error loading movies:", error);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="h-[500px]" ref={wrapperRef}>
        <Loading isLoading={isLoading} imageWidth={100} />
      </div>
    );
  }

  if (movies.length === 0) {
    return <div ref={wrapperRef} className="relative mx-auto w-full"></div>;
  }

  return (
    <div
      ref={wrapperRef}
      className="relative py-4 mx-auto w-full min-h-[200px]"
    >
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
        {!isLoading &&
          movies.map((movie) => <MovieCard key={movie._id} movie={movie} />)}
      </div>

      <Loading isLoading={isLoading} imageWidth={100} />
    </div>
  );
};

export default ListMovieContainer;
