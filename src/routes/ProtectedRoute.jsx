import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import Loading from "../components/Loading";


const ProtectedRoute = ({ redirectPath = "/login" }) => {
  const { user, loading } = useAuth();
  const location = useLocation(); // Lấy location để kiểm tra route hiện tại

  if (loading) {
    return <div className="fixed inset-0 flex items-center justify-center z-[9999] h-full w-full bg-background">
      <Loading isLoading={loading} />
    </div>
  }

  // Nếu user đã đăng nhập và cố truy cập /login, redirect về trang chính
  if (user && location.pathname === "/login") {
    return <Navigate to="/dashboard" replace />;
  }

  // Nếu không có user, redirect về redirectPath
  if (!user) {
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  return <Outlet />; // Render các route con
};

export default ProtectedRoute;