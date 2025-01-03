import React, { useState } from "react";
import axios from "axios";

function LoginPage({ email }: { email: string }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    setError("");
    try {
      await axios({
        method: "post",
        url: "http://localhost:3030/api/v1/auth/login",
        data: {
          email,
          password,
        },
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error: error logging in", error);
      setError("Error: internal error at login in");
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
