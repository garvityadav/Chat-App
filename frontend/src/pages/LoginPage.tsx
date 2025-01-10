import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../contexts/GlobalContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const userContext = useGlobalContext();
  const navigate = useNavigate();
  if (!userContext) {
    return <div>Error: User context is not available</div>;
  }
  const { setUserId, email } = userContext;

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    setError("");
    try {
      const response = await axios({
        method: "post",
        url: `${backendUrl}/api/v1/auth/login`,
        data: {
          email,
          password,
        },
        withCredentials: true,
      });
      setUserId(response.data.data.userId);
      navigate("/main");
    } catch (error) {
      console.error("Error: error logging in", error);
      setError("error");
    }
  };

  return (
    <form method='POST' onSubmit={handleLogin}>
      <p>Email: {email}</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <label htmlFor='password'>Password</label>
      <input
        type='password'
        name='password'
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <button type='submit' onClick={handleLogin} disabled={!password}>
        Login
      </button>
    </form>
  );
}

export default LoginPage;
