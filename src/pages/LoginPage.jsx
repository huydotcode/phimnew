import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { Navigate, useNavigate } from "react-router";
import { toast } from "sonner";
import { db } from "../app/firebase";
import Banner from "../components/Banner";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthProvider";

const LoginPage = () => {
  const { handleSubmit, register, formState, setError, reset, watch, setValue } = useForm(
    {
      defaultValues: {
        email: "",
        password: "",
        name: "", // Thêm trường "Tên" cho đăng ký
        phone: "", // Thêm trường "Số điện thoại" cho đăng ký
      },
    },
  );

  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const {
    user,
    loginWithEmailPassword,
    loginWithGoogle,
    register: registerUser,
    forgotPassword,
  } = useAuth();

  const handleDemoLogin = async () => {
    try {
      // Hỏi tên người dùng
      const name = prompt("Nhập tên của bạn để đăng nhập vào tài khoản demo");
      if (!name) {
        toast.error("Vui lòng nhập tên để đăng nhập vào tài khoản demo");
        return;
      }

      // Tạo reference đến collection "users"
      const userCollection = collection(db, "users");

      // Thêm document mới vào collection "users"
      await addDoc(userCollection, {
        displayName: name,
        email: "", // Để trống hoặc dùng email demo nếu cần
        phoneNumber: "",
        photoURL: "/images/user.png",
        createdAt: new Date(),
        role: "demo",
      });

      // Thông tin tài khoản demo
      const email = "demo@gmail.com";
      const password = "12345678";

      // Cập nhật giá trị form (nếu dùng react-hook-form)
      setValue("email", email);
      setValue("password", password);

      toast("Tài khoản demo đã được điền sẵn vào form");

    } catch (error) {
      console.error("Error logging in with demo account:", error);
      toast.error("Đăng nhập tài khoản demo thất bại");
    }
  };

  const handleLogin = async (data) => {
    try {
      const { email, password } = data;

      const result = await loginWithEmailPassword(email, password);

      if (result) {
        toast.success("Đăng nhập thành công!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("root", {
        message: "Đăng nhập thất bại",
      });
      toast.error(error?.message || "Đăng nhập thất bại");
    }
  };

  const handleForgotPassword = async () => {
    const email = watch("email");

    if (email.trim().length == 0) {
      setError("email", {
        message: "Vui lòng nhập email để reset mật khẩu",
      });
      return;
    }

    await forgotPassword(watch("email"));
  };

  const handleSignUp = async (data) => {
    try {
      const { email, password, name, phone } = data;

      const result = await registerUser({
        email,
        password,
        displayName: name,
        phoneNumber: phone,
        photoURL: "/images/user.png",
      });

      if (result) {
        toast.success("Đăng ký thành công!");
        navigate("/login");
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Đăng ký thất bại!");
    }
  };

  const handleLoginGoogle = async () => {
    try {
      await loginWithGoogle();
      toast.success("Đăng nhập bằng Google thành công!");
      navigate("/");
    } catch (error) {
      console.error("Error logging in with Google:", error);
      toast.error("Đăng nhập bằng Google thất bại!");
    }
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div
      className="relative bg-foreground h-screen w-screen flex items-center justify-center overflow-hidden"
      style={{
        background: "black",
      }}
    >
      <div className="absolute top-2 left-2 z-90 bg-black"
        style={{
          background: "url('/logo.png') no-repeat center center fixed",
          backgroundSize: "cover",
        }}
      />

      <div
        className="absolute left-0"
        style={{
          background: "url('https://assets.nflxext.com/ffe/siteui/vlv3/cb17c41d-6a67-4472-8b91-cca977e65276/web/VN-vi-20250505-TRIFECTA-perspective_5cb3bab8-fb73-411a-a16a-f9193203fc5a_medium.jpg') repeat center center fixed",
          // transform: "rotate(30deg)",
          width: "30vw",
          height: "100%",
        }}
      />

      <div
        className="absolute left-0"
        style={{
          background: "url('/logo.png') repeat center center fixed ",
          transform: "rotate(15deg)",
          width: "30vw",
          height: "200%",
        }}
      />

      <div
        className="absolute top-20 right-4 w-1/3 h-full z-10 hidden xl:flex flex-col select-none items-end"
      >
        <h1 className="text-5xl font-bold text-right mb-4 text-white">
          Chào mừng bạn đến với PhimNew
        </h1>
        <p className="text-lg text-right text-white w-3/4">
          Nơi bạn có thể tìm thấy những bộ phim mới nhất và hấp dẫn nhất hoàn toàn miễn phí!
        </p>
      </div>

      <div
        className="absolute right-0 w-[70vw] h-full"
      >
        <Banner className="h-full" hasInfo={true} hasSwiperThumbnail={false} infoPosition="bottom" />
      </div>

      <div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black to-transparent"
      />

      <div
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
        style={{
          background: "url('/dotted.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="bg-[rgba(0,0,0,0.6)] rounded-xl flex items-center justify-center w-[450px] h-fit z-10 text-white">
        <form
          onSubmit={
            isLogin ? handleSubmit(handleLogin) : handleSubmit(handleSignUp)
          }
          className="flex flex-col gap-4 px-6 py-4 md:px-8 md:py-6 w-full h-full"
        >
          <h1 className="text-3xl font-bold text-center mb-4">
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </h1>

          <div>
            <input
              className="w-full p-3 bg-foreground rounded-md outline-none text-white placeholder:text-white"
              type="email"
              placeholder="Email"
              {...register("email", {
                required: { value: true, message: "Vui lòng nhập email" },
              })}
            />
            {formState?.errors?.email?.message && (
              <p className="text-primary">
                {formState?.errors?.email?.message}
              </p>
            )}
          </div>

          {!isLogin && (
            <>
              <div>
                <input
                  className="w-full p-3 bg-foreground rounded-md outline-none text-white placeholder:text-white"
                  type="text"
                  placeholder="Tên"
                  {...register("name", {
                    required: { value: true, message: "Vui lòng nhập tên" },
                    pattern: {
                      value: /^[A-Za-zÀ-ỵ\s.-]+$/,
                      message: "Tên không hợp lệ", // Thông báo nếu không đúng định dạng
                    },
                    maxLength: {
                      message: "Tên quá dài rồi! Đừng troll nữa!!",
                      value: 30,
                    },
                  })}
                />
                {formState?.errors?.name?.message && (
                  <>
                    <p className="text-primary">
                      {formState?.errors?.name?.message}
                    </p>
                  </>
                )}

                {/* Gợi ý cho user */}
                <p className="ml-2 text-secondary">
                  - Không chứa kí tự đặc biệt
                </p>
              </div>

              <div>
                <input
                  className="w-full p-3 bg-foreground rounded-md outline-none text-white placeholder:text-white"
                  type="text"
                  placeholder="Số điện thoại"
                  {...register("phone", {
                    required: {
                      value: true,
                      message: "Vui lòng nhập số điện thoại",
                    },
                    // Thiết kế pattern phone 10 chữ bắt đầu bằng 0
                    pattern: {
                      value: /^0\d{9}$/, // Regex cho số điện thoại
                      message: "Số điện thoại không hợp lệ ",
                    },
                  })}
                />
                {formState?.errors?.phone?.message && (
                  <p className="text-primary">
                    {formState?.errors?.phone?.message}
                  </p>
                )}
              </div>
            </>
          )}

          <div>
            <input
              className="w-full p-3 bg-foreground rounded-md outline-none text-white placeholder:text-white"
              type="password"
              placeholder="Mật khẩu"
              {...register(
                "password",
                !isLogin && {
                  required: { value: true, message: "Vui lòng nhập mật khẩu" },
                  minLength: {
                    value: 8,
                    message: "Mật khẩu phải lớn hơn 8 kí tự!",
                  },
                },
              )}
            />

            {/* Gợi ý cho user */}

            {formState?.errors?.password?.message && (
              <p className="text-primary">
                {formState?.errors?.password?.message}
              </p>
            )}

            {!isLogin && (
              <p className="ml-2 text-secondary">
                - Độ dài mật khẩu lớn hơn 8 kí tự
              </p>
            )}
          </div>

          <div className="flex justify-end mt-2">
            {isLogin && (
              <p
                className="text-sm text-primary hover:underline cursor-pointer"
                onClick={handleForgotPassword}
              >
                Quên mật khẩu?
              </p>
            )}
          </div>

          <Button
            className="bg-red-600 hover:bg-red-700 text-white font-bold p-2 rounded-md"
            type="submit"
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting
              ? isLogin
                ? "Đang đăng nhập..."
                : "Đang đăng ký..."
              : isLogin
                ? "Đăng nhập"
                : "Đăng ký"}
          </Button>

          {formState?.errors?.root?.message && (
            <p className="text-primary">{formState?.errors?.root?.message}</p>
          )}

          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-gray-600" />
            <span className="text-gray-400 text-sm">Hoặc</span>
            <div className="flex-1 h-px bg-gray-600" />
          </div>

          <Button
            onClick={handleLoginGoogle}
            className="flex items-center justify-center gap-2 bg-white text-black font-semibold p-2 rounded-md"
          >
            <FcGoogle className="text-2xl" />
            Đăng nhập với Google
          </Button>

          <p className="text-center text-sm text-gray-400 mt-4">
            {isLogin ? (
              <>
                Bạn chưa có tài khoản?{" "}
                <span
                  className="text-white font-semibold cursor-pointer hover:underline"
                  onClick={() => {
                    setIsLogin(false);
                    reset();
                  }}
                >
                  Đăng ký
                </span>


              </>
            ) : (
              <>
                Bạn đã có tài khoản?{" "}
                <span
                  className="text-white font-semibold cursor-pointer hover:underline"
                  onClick={() => setIsLogin(true)}
                >
                  Đăng nhập
                </span>
              </>
            )}
          </p>

          {/* Tài khoản demo */}
          <p className="text-center text-sm text-gray-400 hover:cursor-pointer hover:underline"
            onClick={handleDemoLogin}
          >
            Tài khoản demo
          </p>
        </form>
      </div >
    </div >
  );
};

export default LoginPage;
