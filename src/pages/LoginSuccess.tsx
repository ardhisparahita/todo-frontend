import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useLogin } from "../api/useLogin";

const LoginSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithGoogleToken } = useLogin();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // simpan token ke localStorage
    loginWithGoogleToken(token);

    // redirect otomatis ke /home
    navigate("/home");
  }, []);

  return <p>Logging you in...</p>;
};

export default LoginSuccess;
