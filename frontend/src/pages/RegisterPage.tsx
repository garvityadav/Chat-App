import React, { useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../contexts/GlobalContext";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const RegisterPage = () => {
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const userContext = useGlobalContext();
  if (!userContext) {
    return <div>Error: User context is not available</div>;
  }
  const { email } = userContext;

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
      await axios({
        method: "post",
        url: `${backendUrl}/api/v1/auth/register`,
        data: {
          email,
          username,
          password,
          confirmPassword,
        },
        withCredentials: true,
      });
      navigate("/main");
    } catch (error) {
      console.error(error);
      setError("Error: internal error at register in");
      return;
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
      </form>
      {error && <p color='red'>{error}</p>}
    </div>
  );
};

export default RegisterPage;
