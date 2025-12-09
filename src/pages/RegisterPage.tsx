import { useState } from "react";
import { useRegister } from "../api/useRegister";
import { useNavigate } from "react-router";
import { z } from "zod";

// Zod schema untuk validasi frontend
const registerUserSchema = z.object({
  username: z
    .string({ message: "Username must be a string!" })
    .nonempty({ message: "Username is required!" })
    .min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi Zod
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

    setErrors({}); // clear errors jika valid
    try {
      const res = await register(registerData);
      localStorage.setItem("token", res.accessToken); // simpan token
      navigate("/home"); // redirect ke home
    } catch (err) {
      console.log("register error", err);
      alert("Registration failed!");
    }
  };

  // Fungsi untuk mengupdate field dan sekaligus clear error untuk field tersebut
  const handleChange = (field: string, value: string) => {
    setRegisterData({ ...registerData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#222",
        color: "#eee",
        fontFamily: "Arial, sans-serif",
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#333",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          width: "350px",
        }}
      >
        <h1 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          Register
        </h1>

        <form
          onSubmit={handleRegister}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {/* Username Field */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="username">Username:</label>
            <input
              onChange={(e) => handleChange("username", e.target.value)}
              type="text"
              name="username"
              id="username"
              value={registerData.username}
              style={{
                padding: "0.5rem",
                borderRadius: "4px",
                border: `1px solid ${errors.username ? "#ff4d4f" : "#555"}`,
                backgroundColor: "#444",
                color: "#eee",
              }}
              placeholder="Enter your username"
            />
            {errors.username && (
              <span style={{ color: "#ff4d4f", fontSize: "0.85rem" }}>
                {errors.username}
              </span>
            )}
          </div>

          {/* Email Field */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="email">Email:</label>
            <input
              onChange={(e) => handleChange("email", e.target.value)}
              type="email"
              name="email"
              id="email"
              value={registerData.email}
              style={{
                padding: "0.5rem",
                borderRadius: "4px",
                border: `1px solid ${errors.email ? "#ff4d4f" : "#555"}`,
                backgroundColor: "#444",
                color: "#eee",
              }}
              placeholder="Enter your email"
            />
            {errors.email && (
              <span style={{ color: "#ff4d4f", fontSize: "0.85rem" }}>
                {errors.email}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="password">Password:</label>
            <input
              onChange={(e) => handleChange("password", e.target.value)}
              type="password"
              name="password"
              id="password"
              value={registerData.password}
              style={{
                padding: "0.5rem",
                borderRadius: "4px",
                border: `1px solid ${errors.password ? "#ff4d4f" : "#555"}`,
                backgroundColor: "#444",
                color: "#eee",
              }}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span style={{ color: "#ff4d4f", fontSize: "0.85rem" }}>
                {errors.password}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              type="submit"
              style={{
                padding: "0.6rem 2rem",
                backgroundColor: "#4CAF50",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
                color: "white",
              }}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
