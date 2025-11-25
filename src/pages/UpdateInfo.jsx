import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthProvider";
import {
  updateUserField,
  updateUserPhoto,
} from "../services/updateInforService";
import { toast } from "sonner";

const UpdateInfo = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      displayName: user?.displayName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  const [editField, setEditField] = useState(null);
  const [uploading, setUploading] = useState(false);

  const inputRef = useRef(null);

  const onSubmit = async (data) => {
    const value = data[editField];

    try {
      await updateUserField(user?.uid, editField, value);
      user[editField] = value; // cập nhật local
      toast.success(`Đã cập nhật ${editField} thành công!`);
      setEditField(null);
    } catch (error) {
      console.error("Error updating user field:", error);
      toast.error("Lỗi khi cập nhật: " + error.message);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const photoURL = await updateUserPhoto(user.uid, file);
      user.photoURL = photoURL;
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch (err) {
      console.error("Error updating avatar:", err);
      toast.error("Lỗi khi cập nhật ảnh đại diện");
    } finally {
      setUploading(false);
    }
  };

  const getValidation = (name) => {
    switch (name) {
      case "displayName":
        return {
          required: "Tên hiển thị không được để trống.",
          minLength: {
            value: 3,
            message: "Tên phải ít nhất 3 ký tự.",
          },
        };
      case "email":
        return {
          pattern: {
            value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: "Email không hợp lệ.",
          },
          required: {
            value: true,
            message: "Email không được để trống.",
          },
        };
      case "phoneNumber":
        return {
          required: "Số điện thoại không được để trống.",
          pattern: {
            value: /^(0|\+84)\d{9,10}$/,
            message:
              "Số điện thoại không hợp lệ (phải 10-11 số và đúng định dạng VN).",
          },
        };
      default:
        return {};
    }
  };

  const renderField = (label, name, type = "text") => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-400 mb-1">
        {label}
      </label>
      {editField === name ? (
        <form
          key={name}
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center space-x-2"
        >
          <input
            {...register(name, getValidation(name))}
            type={type}
            ref={(e) => {
              register(name).ref(e); // Đảm bảo RHF nhận ref
              inputRef.current = e; // Gán ref cho bạn dùng
            }}
            className="flex-1 h-[48px] bg-foreground text-white px-3 py-2 rounded w-full sm:w-80"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white px-3 py-1 rounded h-[48px]"
          >
            Lưu
          </button>
          <button
            type="button"
            onClick={() => {
              setEditField(null);
              setValue(name, user[name] || "");
            }}
            className="text-gray-400 text-sm hover:text-red-500"
          >
            Hủy
          </button>
        </form>
      ) : (
        <div className="flex items-center justify-between bg-foreground p-3 rounded">
          <span>
            {user[name] || <em className="text-gray-500">Chưa có</em>}
          </span>
          <button
            onClick={() => {
              setEditField(name);
              setValue(name, user[name] || "");
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            }}
            className="text-primary text-sm hover:underline"
          >
            Cập nhật
          </button>
        </div>
      )}
      {errors[name] && (
        <p className="text-red-400 text-sm mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );

  if (!user) return null;

  return (
    <div className="p-4 max-w-xl bg-background rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Cập nhật thông tin</h1>

      {/* Avatar */}
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={user?.photoURL || "/default-avatar.png"}
          alt="Avatar"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <p className="text-lg font-semibold">{user?.displayName}</p>
          <p className="text-sm text-gray-400">{user?.email}</p>

          <label className="mt-2 inline-block text-sm text-primary cursor-pointer hover:underline">
            {uploading ? "Đang tải..." : "Thay đổi ảnh đại diện"}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {renderField("Tên hiển thị", "displayName")}
      {renderField("Email", "email")}
      {renderField("Số điện thoại", "phoneNumber")}
    </div>
  );
};

export default UpdateInfo;
