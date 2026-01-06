import React from "react";
import { Navigate } from "react-router";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem("token");
      return <Navigate to={"/"} replace />;
    }
  } catch (err) {
    localStorage.removeItem("token");
    return <Navigate to={"/"} replace />;
  }
  return children;
};

export default ProtectedRoute;
