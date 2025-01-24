import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../contexts/ExportingContexts";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const sessionDuration = import.meta.env.VITE_SESSION_DURATION;

function LoginPage() {
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState("password");
  const [error, setError] = useState("");
  const { email, setUserId } = useGlobalContext();
  const navigate = useNavigate();

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
      // if successful login
      if (response.data.status == 200) {
        const { userId } = response.data.data;
        const sessionExpiry = Date.now() + parseInt(sessionDuration);
        setUserId(userId, sessionExpiry);
        navigate("/main");
      }
    } catch (error) {
      console.error("Error: error logging in", error);
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        if (status === 401) {
          setError("Error: invalid password");
        } else {
          setError("Error: Internal server error");
        }
      }
    }
  };

  return (
    <form method='POST' onSubmit={handleLogin}>
      <p>Email: {email}</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <label htmlFor='password'>Password</label>
      <input
        type={isVisible}
        name='password'
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        onMouseEnter={() => setIsVisible("text")}
        onMouseLeave={() => setIsVisible("password")}
      />
      <button type='submit' onClick={handleLogin} disabled={!password}>
        Login
      </button>
      <button
        type='button'
        onClick={() => {
          navigate("/");
        }}
      >
        Back
      </button>
    </form>
  );
}

export default LoginPage;
