import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/UserContext";

const PublicRoute = () => {
  const {isLoggedIn} = useAuth()
  return isLoggedIn ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
