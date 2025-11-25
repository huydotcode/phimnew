import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Icons from "../../components/Icons";
import { useAllUsers } from "../../hooks/useUser";
import { assignRole, deleteUser, updateUser } from "../../services/userService";
import { convertTime } from "../../utils/convertTime";

const ModalEdit = ({ show, setShow, user }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user) {
      reset({
        displayName: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      await updateUser(user.uid, {
        displayName: data.displayName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        photoURL: data.photoURL,
      });
      toast("Cập nhật người dùng thành công");
      await queryClient.invalidateQueries({
        queryKey: ["allUsers"],
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Cập nhật người dùng thất bại");
    } finally {
      setShow(false); // Đóng modal sau khi cập nhật
      reset(); // Reset form
    }
  };

  if (!show || !user) return null;

  return (
    <Modal
      centered
      title="Chỉnh sửa người dùng"
      open={show}
      onCancel={() => setShow(false)}
      footer={null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        {/* Tên người dùng */}
        <div className="mb-4">
          <label className="block text-white mb-2">Tên người dùng</label>
          <input
            type="text"
            {...register("displayName", {
              required: "Tên người dùng là bắt buộc",
              minLength: {
                value: 3,
                message: "Tên người dùng phải có ít nhất 3 ký tự",
              },
            })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />

          {errors.displayName && (
            <span className="text-red-500 text-sm">
              {errors.displayName.message}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-white mb-2">Email</label>
          <input
            type="text"
            {...register("email", {
              required: "Email là bắt buộc",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Email không hợp lệ",
              },
            })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />

          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        {/* Số điện thoại */}
        <div className="mb-4">
          <label className="block text-white mb-2">Số điện thoại</label>
          <input
            type="text"
            {...register("phoneNumber", {
              required: "Số điện thoại là bắt buộc",
              pattern: {
                value: /^\d{10,11}$/, // Kiểm tra định dạng số điện thoại
                message: "Số điện thoại không hợp lệ",
              },
            })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />

          {errors.phoneNumber && (
            <span className="text-red-500 text-sm">
              {errors.phoneNumber.message}
            </span>
          )}
        </div>

        {/* Ảnh đại diện */}
        <div className="mb-4">
          <label className="block text-white mb-2">Ảnh đại diện</label>
          <input
            type="text"
            {...register("photoURL", {
              required: "Ảnh đại diện là bắt buộc",
            })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />

          {errors.photoURL && (
            <span className="text-red-500 text-sm">
              {errors.photoURL.message}
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

const ModalDelete = ({ show, setShow, user }) => {
  const queryClient = useQueryClient();
  const onDelete = async () => {
    try {
      await deleteUser(user?.user?.id);
      await queryClient.invalidateQueries({
        queryKey: ["allUsers"],
      });
      toast("Xóa người dùng thành công");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Xóa người dùng thất bại");
    } finally {
      setShow(false); // Đóng modal sau khi xóa
    }
  };

  if (!show || !user) return null;

  return (
    <Modal
      centered
      title="Xóa người dùng"
      open={show}
      onCancel={() => setShow(false)}
      footer={null}
    >
      <div className="p-4">
        <p>
          Bạn có chắc chắn muốn xóa người dùng {user?.displayName} này không?
        </p>
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

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data } = useAllUsers({ enable: true });
  const queryClient = useQueryClient();
  const fileredUsers = data?.filter((user) =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const [sort, setSort] = useState("Tên A-Z"); // Sắp xếp mặc định
  const [editState, setEditState] = useState({
    uid: null,
    displayName: "",
    email: "",
    phoneNumber: "",
    photoURL: "",
    createdAt: null,
    show: false,
  });
  const [deleteState, setDeleteState] = useState({
    user: null,
    show: false,
  });

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChangeRole = async (e, userId) => {
    try {
      assignRole(userId, e.target.value);
      toast("Phân quyền thành công");
      await queryClient.invalidateQueries({
        queryKey: ["allUsers"],
      });
    } catch (error) {
      console.error("Error assigning role:", error);
      toast.error("Phân quyền thất bại");
    }
  };

  const handleEditUser = (user) => {
    setEditState({
      uid: user.id,
      displayName: user.displayName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      createdAt: user.createdAt,

      show: true,
    });
  };

  return (
    <>
      <ModalEdit
        user={editState}
        show={editState.show}
        setShow={(setShow) => {
          setEditState((prev) => ({ ...prev, show: setShow }));
        }}
      />

      <ModalDelete
        user={deleteState}
        show={deleteState.show}
        setShow={(setShow) => {
          setDeleteState((prev) => ({ ...prev, show: setShow }));
        }}
      />

      <div className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold">Danh sách người dùng</h2>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <label className="text-white mr-2 text-sm">Tìm kiếm:</label>

          <input
            type="text"
            placeholder="Tìm kiếm tên người dùng..."
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
              <option value="Tham gia gần đây">Tham gia gần đây</option>
              <option value="Tham gia lâu nhất">Tham gia lâu nhất</option>
              <option value="Quyền admin">Quyền admin</option>
              <option value="Quyền người dùng">Quyền người dùng</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-900 text-sm text-left text-white">
            <thead className="bg-primary">
              <tr>
                <th className="px-4 py-2 border border-gray-900"></th>
                <th className="px-4 py-2 border border-gray-900">Tên</th>
                <th className="px-4 py-2 border border-gray-900 hidden xl:table-cell">
                  Email
                </th>
                <th className="px-4 py-2 border border-gray-900 hidden xl:table-cell">
                  SDT
                </th>
                <th className="px-4 py-2 border border-gray-900">
                  Tham gia ngày
                </th>
                <th className="px-4 py-2 border border-gray-900">Quyền</th>
                <th className="px-4 py-2 border border-gray-900">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {fileredUsers
                ?.filter((user) => !user.isDeleted) // Lọc người dùng đã xóa
                .sort((a, b) => {
                  if (sort === "Tên A-Z") {
                    return a.displayName.localeCompare(b.displayName);
                  } else if (sort === "Tên Z-A") {
                    return b.displayName.localeCompare(a.displayName);
                  } else if (sort === "Tham gia gần đây") {
                    return b.createdAt - a.createdAt;
                  } else if (sort === "Tham gia lâu nhất") {
                    return a.createdAt - b.createdAt;
                  } else if (sort === "Quyền admin") {
                    return a.role === "admin" ? -1 : 1;
                  } else if (sort === "Quyền người dùng") {
                    return a.role === "user" ? -1 : 1;
                  }

                  return 0;
                })
                .map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-700 border border-gray-800"
                  >
                    <td className="w-10 h-10 p-2 border border-gray-900">
                      {user?.photoURL && (
                        <img
                          src={user?.photoURL}
                          alt={user?.displayName}
                          className=" rounded-full w-full h-full object-cover"
                        />
                      )}
                    </td>
                    <td className="px-4 py-2 border border-gray-900">
                      {user?.displayName}
                    </td>
                    <td className="px-4 py-2 border border-gray-900 hidden xl:table-cell">
                      {user?.email}
                    </td>
                    <td className="px-4 py-2 border border-gray-900 hidden xl:table-cell">
                      {user?.phoneNumber}
                    </td>
                    <td className="px-4 py-2 border border-gray-900">
                      {convertTime(user.createdAt.toDate())}
                    </td>
                    <td className="px-4 py-2 border border-gray-900">
                      <div className="flex items-center justify-between">
                        <select
                          value={user?.role}
                          onChange={(e) => {
                            handleChangeRole(e, user.id);
                          }}
                          className="bg-black text-sm text-white px-3 py-2 rounded"
                        >
                          <option value="user">Người dùng</option>
                          <option value="admin">Admin</option>
                          <option value="demo">Demo</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-2 flex items-center">
                      <div>
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
                          onClick={() => handleEditUser(user)}
                        >
                          Sửa
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => {
                            setDeleteState({
                              user,
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

export default UserList;
