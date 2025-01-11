import React, { useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../contexts/GlobalContext";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const RegisterPage = () => {
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();
  const globalContext = useGlobalContext();
  const email = globalContext?.email;
  const setUserId = globalContext?.setUserId;
  const handleRegister = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError("Email, password and confirm password are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password and confirm password should match");
      return;
    }
    setError("");
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/auth/register`,
        {
          email,
          username,
          password,
          confirmPassword,
        },
        { withCredentials: true }
      );
      if (response.data.status == "200" && socket) {
        const userId = response.data.data.userId;
        socket.emit("register", {
          userId,
        });
        if (setUserId) {
          setUserId(userId);
        }
        navigate("/main");
      }
    } catch (error) {
      console.error(error);
      setError("Error: internal error at register in");
      navigate("/");
    }
  };

  return (
    <div>
      <form action='' method='POST' onSubmit={handleRegister}>
        <p>Email: {email}</p>
        <label htmlFor='userName'>User name</label>
        <input
          type='text'
          name='userName'
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          name='password'
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <label htmlFor='confirmPassword'>Confirm password</label>
        <input
          type='password'
          name='confirmPassword'
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
        />
        <button
          type='submit'
          onClick={handleRegister}
          disabled={!password || !confirmPassword}
        >
          Register
        </button>
        <button type='button' onClick={() => navigate("/")}>
          s Back
        </button>
      </form>
      {error && <p color='red'>{error}</p>}
    </div>
  );
};

export default RegisterPage;
