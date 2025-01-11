import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../contexts/GlobalContext";
import { useSocket } from "../contexts/SocketContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function LoginPage() {
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState("password");
  const [error, setError] = useState("");
  const socket = useSocket();
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

      if (response.data.status == 200 && socket) {
        const userId = response.data.data.userId;
        socket.emit("register", {
          userId,
        });
        setUserId(userId);
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
