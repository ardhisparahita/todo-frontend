import { axiosInstance } from "../lib/axios"

interface PayloadData {
  username: string,
  email: string,
  password: string
}

interface RegisterResponse {
  accessToken: string
}

export const useRegister = () => {
  const register = async (payload: PayloadData): Promise<RegisterResponse> => {
    try {
      const res = await axiosInstance.post<RegisterResponse>("/api/auth/register", {
        username: payload.username,
        email: payload.email,
        password: payload.password
      })
      return res.data
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  return {
    register
  }
}
