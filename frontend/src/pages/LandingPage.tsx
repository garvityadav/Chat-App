import React, { useState } from "react";
import axios from "axios";

function LandingPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");

  const checkUserExists = async (email: string): Promise<boolean> => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    setError("");
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:3030/api/v1/auth/check-user",
        headers: {
          "Content-Type": "application/json",
        },
        data: { email },
        withCredentials: true,
      });
      console.log(response.data);
      if (!response) {
        return false;
      }
      return true;
    } catch (error) {
      console.error("error checking user exist ", error);
      setError("Error: User email not found, Please register");
      return false;
    }
  };

  const handleNext = async (): Promise<void> => {
    //checking if user exist
    if (!email) {
      setError("Email is required");
      return;
    }
    setError("");
    try {
      const userExists = await checkUserExists(email);
      console.log(userExists);
      if (userExists) {
        setStep(2);
      } else {
        setStep(3);
      }
    } catch (error) {
      console.error("Error: in HandleNext", error);
      setError("Error: In hadndle next fun");
    }
  };

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
        url: "http://localhost:3030/api/v1/auth/login",
        data: {
          email,
          password,
        },
        withCredentials: true,
      });
      console.log(response);
    } catch (error) {
      console.error("Error: error logging in", error);
      setError("Error: internal error at login in");
    }
  };
  const handleRegister = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    console.log("inside register");
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
      const response = await axios({
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
      console.log(response);
    } catch (error) {
      console.error(error);
      setError("Error: internal error at register in");
      return;
    }
  };
  return (
    <div>
      <form
        method='POST'
        onSubmit={
          step == 2 ? handleLogin : step == 3 ? handleRegister : undefined
        }
      >
        <h2>Welcome to chat App</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {step == 1 && (
          <>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type='button' onClick={handleNext} disabled={!email}>
              Next
            </button>
          </>
        )}
        {step == 2 && (
          <>
            <p>Email: {email}</p>
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
          </>
        )}
        {step == 3 && (
          <>
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
          </>
        )}
      </form>
    </div>
  );
}

export default LandingPage;
