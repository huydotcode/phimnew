import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addWatchedMovie,
  getWatchedMoviesByUser,
} from "../../services/watchedService";

export const fetchWatchedMovies = createAsyncThunk(
  "movies/fetchWatchedMovies",
  async (uid, { rejectWithValue }) => {
    try {
      const data = await getWatchedMoviesByUser(uid);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const addWatchedMovieThunk = createAsyncThunk(
  "movies/addWatchedMovieThunk",
  async ({ uid, movie, currentEpisode }, { rejectWithValue }) => {
    try {
      const data = await addWatchedMovie({
        movie,
        userId: uid,
        currentEpisode,
      });
      if (!data) {
        return null;
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
