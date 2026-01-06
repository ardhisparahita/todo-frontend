import { axiosInstance } from "../lib/axios";

interface LoginPayload {
  usernameOrEmail: string;
  password: string;
}

export const useLogin = () => {
  const login = async (payload: LoginPayload) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", payload);

      const { token, user } = response.data;

      if (!token) {
        throw new Error("Token tidak ditemukan dari server");
      }

      localStorage.setItem("token", token);

      return { token, user };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login gagal");
    }
  };

  const loginWithGoogleToken = (token: string) => {
    if (!token) {
      throw new Error("Token Google tidak valid");
    }

    localStorage.setItem("token", token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

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
