import { axiosInstance } from "../lib/axios";

interface PayloadData {
  usernameOrEmail: string;
  password: string;
}

export const useLogin = () => {
  const login = async (payload: PayloadData) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", payload);
      // Simpan token ke localStorage
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error: any) {
      // Lempar error agar bisa ditangkap di component
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  return { login };
};
