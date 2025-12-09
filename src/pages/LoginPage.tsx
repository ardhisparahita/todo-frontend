import React, { useState } from "react";
import { useLogin } from "../api/useLogin";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useLogin();
  const [loginData, setLoginData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(loginData);
      navigate("/home");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
        <h1 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Login</h1>

        {error && (
          <div
            style={{
              color: "red",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <label htmlFor="username" style={{ width: "90px" }}>
              Username:
            </label>
            <input
              onChange={(e) =>
                setLoginData({ ...loginData, usernameOrEmail: e.target.value })
              }
              type="text"
              name="username"
              id="username"
              style={{
                flex: 1,
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #555",
                backgroundColor: "#444",
                color: "#eee",
              }}
              placeholder="Enter your username or Email"
            />
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <label htmlFor="password" style={{ width: "90px" }}>
              Password:
            </label>
            <input
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              type="password"
              name="password"
              id="password"
              style={{
                flex: 1,
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #555",
                backgroundColor: "#444",
                color: "#eee",
              }}
              placeholder="Enter your password"
            />
          </div>

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
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        {/* Register link */}
        <div
          style={{
            marginTop: "1rem",
            textAlign: "center",
            fontSize: "0.9rem",
            color: "#ccc",
          }}
        >
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            style={{
              background: "none",
              border: "none",
              color: "#4CAF50",
              cursor: "pointer",
              fontWeight: "bold",
              textDecoration: "underline",
              padding: 0,
              margin: 0,
            }}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
