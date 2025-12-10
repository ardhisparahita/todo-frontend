import { axiosInstance } from "../lib/axios";

interface LoginPayload {
  usernameOrEmail: string;
  password: string;
}

export const useLogin = () => {
  // ✅ LOGIN MANUAL
  const login = async (payload: LoginPayload) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", payload);

      const { token, user } = response.data;

      if (!token) {
        throw new Error("Token tidak ditemukan dari server");
      }

      // ✅ Simpan token
      localStorage.setItem("token", token);

      return { token, user };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login gagal");
    }
  };

  // ✅ LOGIN DARI GOOGLE REDIRECT (?token=xxx)
  const loginWithGoogleToken = (token: string) => {
    if (!token) {
      throw new Error("Token Google tidak valid");
    }

    localStorage.setItem("token", token);
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // ✅ CEK SUDAH LOGIN ATAU BELUM
  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  return {
    login,
    loginWithGoogleToken,
    logout,
    isAuthenticated,
  };
};
