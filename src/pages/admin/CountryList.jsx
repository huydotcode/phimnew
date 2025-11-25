import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useQueryClient } from "@tanstack/react-query";
import { IoAddOutline } from "react-icons/io5";
import { toast } from "sonner";
import Icons from "../../components/Icons";
import { useAllCountries } from "../../hooks/useCountry";
import {
  addCountry,
  deleteCountry,
  updateCountry,
} from "../../services/countryService";

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

      const newCountry = await addCountry(countryData);

      if (!newCountry) {
        toast.error("Thêm quốc gia thất bại");
        return;
      }
      toast("Thêm quốc gia thành công");
      queryClient.invalidateQueries({
        queryKey: ["allCountries"],
      }); // Làm mới danh sách quốc gia
    } catch (error) {
      console.error("Error adding movie:", error);
      toast.error("Thêm quốc gia thất bại");
    } finally {
      setShow(false); // Đóng modal sau khi thêm
      reset(); // Reset form
    }
  };

  if (!show) return null;

  return (
    <Modal
      title="Thêm quốc gia"
      open={show}
      onCancel={() => setShow(false)}
      footer={null}
      centered
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        {/* Tên quốc gia */}
        <div className="mb-4 flex-1">
          <label className="block text-white mb-2">Tên quốc gia</label>
          <input
            type="text"
            {...register("name", {
              required: "Tên quốc gia là bắt buộc",
              minLength: {
                value: 3,
                message: "Tên quốc gia phải có ít nhất 3 ký tự",
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

const ModalEdit = ({ show, setShow, country }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (country) {
      reset({
        name: country.name,
        slug: country.slug,
      });
    }
  }, [country, reset]);

  const onSubmit = async (data) => {
    try {

      // await updateMovie(movieData.id, movieData);
      await updateCountry(country.id, {
        name: data.name,
        slug: data.slug,
      });
      toast("Cập nhật quốc gia thành công");
      await queryClient.invalidateQueries({
        queryKey: ["allCountries"],
      });
    } catch (error) {
      console.error("Error updating cateogyr:", error);
      toast.error("Cập nhật quốc gia thất bại");
    } finally {
      setShow(false); // Đóng modal sau khi cập nhật
      reset(); // Reset form
    }
  };

  if (!show || !country) return null;

  return (
    <Modal
      centered
      title="Chỉnh sửa quốc gia"
      open={show}
      onCancel={() => setShow(false)}
      footer={null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        {/* Tên phim */}
        <div className="mb-4">
          <label className="block text-white mb-2">Tên quốc gia</label>
          <input
            type="text"
            {...register("name", {
              required: "Tên quốc gia là bắt buộc",
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

const ModalDelete = ({ show, setShow, country }) => {
  const queryClient = useQueryClient();
  const onDelete = async () => {
    try {

      await deleteCountry(country?.id);
      await queryClient.invalidateQueries({
        queryKey: ["allCountries"],
      });
      toast("Xóa quốc gia thành công");
    } catch (error) {
      console.error("Error deleting country:", error);
      toast.error("Xóa quốc gia thất bại");
    } finally {
      setShow(false); // Đóng modal sau khi xóa
    }
  };

  if (!show || !country) return null;

  return (
    <Modal
      centered
      title="Xóa quốc gia"
      open={show}
      onCancel={() => setShow(false)}
      footer={null}
    >
      <div className="p-4">
        <p>Bạn có chắc chắn muốn xóa quốc gia {country?.name} này không?</p>
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

const CountryList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data } = useAllCountries({ enable: true });
  const filteredCountries = data?.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const [sort, setSort] = useState("Tên A-Z"); // Sắp xếp mặc định
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [editState, setEditState] = useState({
    id: null,
    name: null,
    slug: null,

    show: false,
  });
  const [deleteState, setDeleteState] = useState({
    id: null,
    show: false,
  });

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditMovie = (country) => {
    setEditState({
      id: country.id,
      name: country.name,
      slug: country.slug,

      show: true,
    });
  };

  return (
    <>
      <ModalAdd show={showAddMovie} setShow={setShowAddMovie} />

      <ModalEdit
        country={editState}
        show={editState.show}
        setShow={(setShow) => {
          setEditState((prev) => ({ ...prev, show: setShow }));
        }}
      />

      <ModalDelete
        country={deleteState}
        show={deleteState.show}
        setShow={(setShow) => {
          setDeleteState((prev) => ({ ...prev, show: setShow }));
        }}
      />

      <div className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold">Danh sách quốc gia</h2>

          <button
            className="bg-primary text-white px-4 py-1 rounded flex items-center gap-2 hover:opacity-80"
            onClick={() => setShowAddMovie((prev) => !prev)}
          >
            <IoAddOutline className="w-6 h-6" />{" "}
            <span className="hidden md:block">Thêm quốc gia</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <label className="text-white mr-2 text-sm">Tìm kiếm:</label>

          <input
            type="text"
            placeholder="Tìm kiếm tên quốc gia..."
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
                <th className="px-4 py-2 border border-gray-900">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredCountries
                .sort((a, b) => {
                  if (sort === "Tên A-Z") {
                    return a.name.localeCompare(b.name);
                  } else if (sort === "Tên Z-A") {
                    return b.name.localeCompare(a.name);
                  } else {
                    return 0; // Không sắp xếp nếu không có điều kiện nào khớp
                  }
                })
                .map((country) => (
                  <tr
                    key={country.id}
                    className="hover:bg-gray-700 border border-gray-800"
                  >
                    <td className="px-4 py-2 border border-gray-900">
                      {country.name}
                    </td>
                    <td className="px-4 py-2 border border-gray-900">
                      {country.slug}
                    </td>
                    <td className="px-4 py-2 flex items-center">
                      <div>
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
                          onClick={() => handleEditMovie(country)}
                        >
                          Sửa
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => {
                            setDeleteState({
                              id: country.id,
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

export default CountryList;
