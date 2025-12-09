import React from "react";
import { Navigate } from "react-router";
import  {jwtDecode}  from "jwt-decode";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Ambil token dari localStorage
  const token = localStorage.getItem("token");

  // Jika tidak ada token, redirect ke login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Bisa juga menambahkan validasi token JWT di sini (opsional)
  // misal decode dan cek expired, dsb

  try {
    const decoded: any = jwtDecode(token)
    const currentTime = Date.now() / 1000
    
    if(decoded.exp < currentTime) {
      localStorage.removeItem("token")
      return <Navigate to={"/"} replace/>
    }
  } catch (err) {
    localStorage.removeItem("token")
    return <Navigate to={"/"} replace/>
  }
  return children;
};

export default ProtectedRoute;
