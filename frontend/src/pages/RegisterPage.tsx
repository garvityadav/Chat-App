import React, { useState } from "react";
import axios from "axios";

const RegisterPage = ({ email }: { email: string }) => {
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
        url: "http://localhost:3030/api/v1/auth/register",
        data: {
          email,
          username,
          password,
          confirmPassword,
        },
        withCredentials: true,
      });
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
