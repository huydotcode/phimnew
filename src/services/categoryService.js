import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  Timestamp,
  updateDoc,
  where,
  getCountFromServer,
} from "firebase/firestore";
import mongoose from "mongoose";
import { db } from "../app/firebase";

const MAX_CATEGORIES = 6;
// const PAGE_SIZE = 20; // Số lượng phim hiển thị trên mỗi trang

export const getTopCategories = async () => {
  try {
    const q = query(
      collection(db, "categories"),
      orderBy("totalViews", "desc"),
      limit(MAX_CATEGORIES),
    );

    const querySnapshot = await getDocs(q);
    const categories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return categories;
  } catch (error) {
    console.error("Error fetching top categories:", error);
    throw error;
  }
};

export const getAllCategories = async () => {
  try {
    const q = query(
      collection(db, "categories"),
      orderBy("totalViews", "desc"),
    );

    const querySnapshot = await getDocs(q);
    const categories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return categories;
  } catch (error) {
    console.error("Error fetching all categories:", error);
    throw error;
  }
};

export const getMoviesByCategory = async (
  categorySlug,
  page,
  lastVisible = null,
) => {
  const PAGE_SIZE = 20; // Số lượng phim hiển thị trên mỗi trang

  try {
    let q = query(
      collection(db, "movies"),
      where("categorySlugs", "array-contains", categorySlug), // Lọc theo slug thể loại
      orderBy("year", "desc"),
      limit(PAGE_SIZE),
    );

    // Nếu có `lastVisible`, thêm `startAfter` để phân trang
    if (lastVisible) {
      q = query(
        collection(db, "movies"),
        where("categorySlugs", "array-contains", categorySlug),
        orderBy("year", "desc"),
        startAfter(lastVisible),
        limit(PAGE_SIZE),
      );
    }

    const snapshot = await getDocs(q);

    const countAllMovies = await getCountFromServer(
      query(
        collection(db, "movies"),
        where("categorySlugs", "array-contains", categorySlug),
      ),
    );

    // Lấy document cuối cùng để hỗ trợ phân trang
    const newLastVisible = snapshot.docs[snapshot.docs.length - 1];

    // Trả về danh sách phim và document cuối cùng
    return {
      movies: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      lastVisible: newLastVisible,
      countAllMovies: countAllMovies.data().count,
      totalPages: Math.ceil(countAllMovies.data().count / PAGE_SIZE), // Tổng số trang
    };
  } catch (error) {
    console.error("Error fetching movies by category:", error);
    throw error;
  }
};

// Thêm thể loại
export const addCategory = async (category) => {
  try {
    const categoryId = new mongoose.Types.ObjectId().toString(); // Tạo ID mới cho thể loại
    const newCategory = {
      ...category,
      id: categoryId,
      totalViews: 0, // Khởi tạo totalViews bằng 0
      createdAt: Timestamp.now(), // Thời gian tạo thể loại
      updatedAt: Timestamp.now(), // Thời gian cập nhật thể loại
    };

    // Thêm thể loại vào Firestore
    const docRef = doc(db, "categories", categoryId);

    await setDoc(docRef, newCategory);

    return newCategory;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

// Cập nhật thể loại
export const updateCategory = async (categoryId, updatedData) => {
  try {
    // Cập nhật thể loại trong Firestore
    const categoryRef = doc(
      db,
      "categories",
      Array.isArray(categoryId) ? categoryId[0] : categoryId,
    );
    await updateDoc(categoryRef, {
      ...updatedData,
      updatedAt: Timestamp.now(), // Cập nhật thời gian cập nhật
    });
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Xóa thể loại
export const deleteCategory = async (categoryId) => {
  try {
    const categoryRef = doc(
      db,
      "categories",
      Array.isArray(categoryId) ? categoryId[0] : categoryId,
    );

    await deleteDoc(categoryRef);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
