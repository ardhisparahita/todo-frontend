import React, { useState } from "react";
import { useNavigate } from "react-router";
import { z } from "zod";
import { useLogin } from "../api/useLogin";
import "./../styles/loginpage.css";

const loginSchema = z.object({
  usernameOrEmail: z.string().nonempty("Username atau Email harus diisi"),
  password: z.string().nonempty("Password harus diisi"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useLogin();

  const [loginData, setLoginData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    usernameOrEmail?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleChange = (
    field: "usernameOrEmail" | "password",
    value: string
  ) => {
    setLoginData({ ...loginData, [field]: value });
    setErrors({ ...errors, [field]: undefined });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse(loginData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        usernameOrEmail: fieldErrors.usernameOrEmail?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      await login({
        usernameOrEmail: loginData.usernameOrEmail,
        password: loginData.password,
      });
      navigate("/home");
    } catch (err: any) {
      const msg = err.message || "Login gagal";
      if (msg.toLowerCase().includes("password")) {
        setErrors({ password: msg });
      } else {
        setErrors({ usernameOrEmail: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      "https://todo-backend-production-4634.up.railway.app/api/auth/google";
  };

  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <div className="login-container">
        <div className="login-card">
          <h1>Welcome Back</h1>
          <p>Masuk untuk melanjutkan ke akun Anda</p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username atau Email</label>
              <input
                type="text"
                placeholder="Masukkan username atau email"
                value={loginData.usernameOrEmail}
                onChange={(e) =>
                  handleChange("usernameOrEmail", e.target.value)
                }
              />
              {errors.usernameOrEmail && (
                <span className="error-msg">{errors.usernameOrEmail}</span>
              )}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Masukkan password"
                value={loginData.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
              {errors.password && (
                <span className="error-msg">{errors.password}</span>
              )}
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="or-divider">OR</div>

          <button className="google-btn" onClick={handleGoogleLogin}>
            <span className="google-icon">
              <svg
                viewBox="0 0 488 512"
                fill="currentColor"
                width="20"
                height="20"
              >
                <path d="M488 261.8c0-17.3-1.5-34-4.3-50.3H249v95.1h134.6c-5.8 31.2-23 57.6-49.2 75.4v62.6h79.5c46.7-43 73.1-106.4 73.1-182.8zM249 492c67.3 0 123.8-22.3 165-60.4l-79.5-62.6c-22.2 14.9-50.8 23.6-85.5 23.6-65.8 0-121.6-44.4-141.5-104.2H26.5v65.5C67.8 437 152.5 492 249 492zM107.5 299.4c-4.8-14.1-7.6-29.1-7.6-44.4s2.8-30.3 7.6-44.4v-65.5H26.5C9.3 192.7 0 218.2 0 244.9s9.3 52.2 26.5 76.9l81-65.5zM249 97.1c35.7 0 67.7 12.3 92.9 36.3l69.6-69.6C372.8 28.3 316.3 0 249 0 152.5 0 67.8 55 26.5 138.2l81 65.5C127.4 141.5 183.2 97.1 249 97.1z" />
              </svg>
            </span>
            <span>Login with Google</span>
          </button>

          <p className="register-text">
            Belum punya akun?{" "}
            <button
              style={{ color: "#007bff" }}
              onClick={() => navigate("/register")}
            >
              Daftar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
