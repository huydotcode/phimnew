import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAllCategories } from "../../hooks/useCategory";

import { useQueryClient } from "@tanstack/react-query";
import { IoAddOutline } from "react-icons/io5";
import { toast } from "sonner";
import Icons from "../../components/Icons";
import {
  addCategory,
  deleteCategory,
  updateCategory,
} from "../../services/categoryService";

const PAGE_SIZE = 10;

const ModalAdd = ({ show, setShow }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const queryClient = useQueryClient();

  const onSubmit = async (data) => {
    try {
      const countryData = {
        name: data.name,
        slug: data.slug,
      };

      await addCategory(countryData);
      toast("Thêm thể loại thành công");
      queryClient.invalidateQueries({
        queryKey: ["allCountries"],
      }); // Làm mới danh sách thể loại
    } catch (error) {
      console.error("Error adding movie:", error);
      toast.error("Thêm thể loại thất bại");
    } finally {
      setShow(false); // Đóng modal sau khi thêm
      reset(); // Reset form
    }
  };

  if (!show) return null;

  return (
    <Modal
      title="Thêm thể loại"
      open={show}
      onCancel={() => setShow(false)}
      footer={null}
      centered
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        {/* Tên thể loại */}
        <div className="mb-4 flex-1">
          <label className="block text-white mb-2">Tên thể loại</label>
          <input
            type="text"
            {...register("name", {
              required: "Tên thể loại là bắt buộc",
              minLength: {
                value: 3,
                message: "Tên thể loại phải có ít nhất 3 ký tự",
              },
            })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />

          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        {/* Slug */}
        <div className="mb-4 flex-1">
          <label className="block text-white mb-2">Slug</label>
          <input
            type="text"
            {...register("slug", {
              required: "Slug là bắt buộc",
              minLength: {
                value: 3,
              },
            })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />

          {errors.slug && (
            <span className="text-red-500 text-sm">{errors.slug.message}</span>
          )}
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

const ModalEdit = ({ show, setShow, category }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        slug: category.slug,
        totalViews: category.totalViews,
      });
    }
  }, [category, reset]);

  const onSubmit = async (data) => {
    try {

      // await updateMovie(movieData.id, movieData);
      await updateCategory(category.id, {
        name: data.name,
        slug: data.slug,
        totalViews: data.totalViews,
      });
      toast("Cập nhật thể lọai thành công");
      await queryClient.invalidateQueries({
        queryKey: ["allCategories"],
      });
    } catch (error) {
      console.error("Error updating cateogyr:", error);
      toast.error("Cập nhật thể loại thất bại");
    } finally {
      setShow(false); // Đóng modal sau khi cập nhật
      reset(); // Reset form
    }
  };

  if (!show || !category) return null;

  return (
    <Modal
      centered
      title="Chỉnh sửa thể loại"
      open={show}
      onCancel={() => setShow(false)}
      footer={null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        {/* Tên phim */}
        <div className="mb-4">
          <label className="block text-white mb-2">Tên thể loại</label>
          <input
            type="text"
            {...register("name", {
              required: "Tên thể loại là bắt buộc",
            })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />

          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        {/* Slug */}
        <div className="mb-4">
          <label className="block text-white mb-2">Slug</label>
          <input
            type="text"
            {...register("slug", {
              required: "Slug là bắt buộc",
            })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />

          {errors.slug && (
            <span className="text-red-500 text-sm">{errors.slug.message}</span>
          )}
        </div>

        {/* Tổng lượt xem */}
        <div className="mb-4">
          <label className="block text-white mb-2">Tổng lượt xem</label>
          <input
            type="text"
            {...register("totalViews", {
              required: "Tổng lượt xem là bắt buộc",
              pattern: {
                value: /^[0-9]+$/,
                message: "Tổng lượt xem phải là một số",
              },
            })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />

          {errors.totalViews && (
            <span className="text-red-500 text-sm">
              {errors.totalViews.message}
            </span>
          )}
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

const ModalDelete = ({ show, setShow, category }) => {
  const queryClient = useQueryClient();
  const onDelete = async () => {
    try {

      await deleteCategory(category?.category?.id);
      await queryClient.invalidateQueries({
        queryKey: ["allCategories"],
      });
      toast("Xóa thể loại thành công");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Xóa thể loại thất bại");
    } finally {
      setShow(false); // Đóng modal sau khi xóa
    }
  };

  if (!show || !category) return null;

  return (
    <Modal
      centered
      title="Xóa thể loại"
      open={show}
      onCancel={() => setShow(false)}
      footer={null}
    >
      <div className="p-4">
        <p>Bạn có chắc chắn muốn xóa thể loại {category?.name} này không?</p>
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

const CategoryList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data } = useAllCategories({ enable: true });
  const fileredCategories = data?.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const [sort, setSort] = useState("Mới nhất"); // Sắp xếp mặc định
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [editState, setEditState] = useState({
    id: null,
    name: null,
    slug: null,
    totalViews: null,
    show: false,
  });
  const [deleteState, setDeleteState] = useState({
    id: null,
    show: false,
  });

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditMovie = (category) => {
    setEditState({
      id: category.id,
      name: category.name,
      slug: category.slug,
      totalViews: category.totalViews,
      show: true,
    });
  };

  return (
    <>
      <ModalAdd show={showAddMovie} setShow={setShowAddMovie} />

      <ModalEdit
        category={editState}
        show={editState.show}
        setShow={(setShow) => {
          setEditState((prev) => ({ ...prev, show: setShow }));
        }}
      />

      <ModalDelete
        category={deleteState}
        show={deleteState.show}
        setShow={(setShow) => {
          setDeleteState((prev) => ({ ...prev, show: setShow }));
        }}
      />

      <div className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold">Danh sách thể loại</h2>

          <button
            className="bg-primary text-white px-4 py-1 rounded flex items-center gap-2 hover:opacity-80"
            onClick={() => setShowAddMovie((prev) => !prev)}
          >
            <IoAddOutline className="w-6 h-6" />{" "}
            <span className="hidden md:block">Thêm thể loại</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <label className="text-white mr-2 text-sm">Tìm kiếm:</label>

          <input
            type="text"
            placeholder="Tìm kiếm tên thể loại..."
            value={searchTerm}
            onChange={handleInputChange}
            className=" px-3 py-2 text-sm rounded bg-foreground w-64"
          />

          {/* Sort */}
          <div className="flex items-center ml-auto">
            <label className="text-white text-sm">
              <Icons.Sort className="w-5 h-5" />
            </label>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
              }}
              className="bg-black text-sm text-white px-3 py-2 rounded"
            >
              <option value="Mới nhất">Mới nhất</option>
              <option value="Cũ nhất">Cũ nhất</option>
              <option value="Xem nhiều nhất">Xem nhiều nhất</option>
              <option value="Xem ít nhất">Xem ít nhất</option>
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
                <th className="px-4 py-2 border border-gray-900">Tên</th>
                <th className="px-4 py-2 border border-gray-900">Slug</th>
                <th className="px-4 py-2 border border-gray-900">
                  Tổng lượt xem
                </th>
                <th className="px-4 py-2 border border-gray-900">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {fileredCategories
                .sort((a, b) => {
                  if (sort === "Mới nhất") {
                    return b.createdAt - a.createdAt;
                  } else if (sort === "Cũ nhất") {
                    return a.createdAt - b.createdAt;
                  } else if (sort === "Xem nhiều nhất") {
                    return b.totalViews - a.totalViews;
                  } else if (sort === "Xem ít nhất") {
                    return a.totalViews - b.totalViews;
                  } else if (sort === "Tên A-Z") {
                    return a.name.localeCompare(b.name);
                  } else if (sort === "Tên Z-A") {
                    return b.name.localeCompare(a.name);
                  } else {
                    return 0; // Không sắp xếp nếu không có điều kiện nào khớp
                  }
                })
                .map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-gray-700 border border-gray-800"
                  >
                    <td className="px-4 py-2 border border-gray-900">
                      {category.name}
                    </td>
                    <td className="px-4 py-2 border border-gray-900">
                      {category.slug}
                    </td>
                    <td className="px-4 py-2 border border-gray-900">
                      {category.totalViews}
                    </td>
                    <td className="px-4 py-2 flex items-center">
                      <div>
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
                          onClick={() => handleEditMovie(category)}
                        >
                          Sửa
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => {
                            setDeleteState({
                              category,
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
      </div>
    </>
  );
};

export default CategoryList;
