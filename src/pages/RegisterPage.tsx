import { useState } from "react";
import { useNavigate } from "react-router";
import { z } from "zod";
import { useRegister } from "../api/useRegister";
import "./../styles/registerpage.css";

const registerUserSchema = z.object({
  username: z
    .string()
    .nonempty("Username harus diisi")
    .min(3, "Username minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useRegister();

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleChange = (field: string, value: string) => {
    setRegisterData({ ...registerData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = registerUserSchema.safeParse(registerData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        username: fieldErrors.username?.[0] || "",
        email: fieldErrors.email?.[0] || "",
        password: fieldErrors.password?.[0] || "",
      });
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const res = await register(registerData);
      // Simpan token jika backend mengembalikan JWT
      localStorage.setItem("token", res.accessToken);
      navigate("/home");
    } catch (err: any) {
      alert(err.response?.data?.message || "Registrasi gagal!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`register-container ${darkMode ? "dark-mode" : "light-mode"}`}
    >
      <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <div className="register-card">
        <h1>Register</h1>
        <p>Buat akun untuk mulai menggunakan aplikasi</p>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Masukkan username"
              value={registerData.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />
            {errors.username && (
              <span className="error-msg">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={registerData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={registerData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            {errors.password && (
              <span className="error-msg">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="register-text">
          Sudah punya akun?{" "}
          <button onClick={() => navigate("/login")}>Login</button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
