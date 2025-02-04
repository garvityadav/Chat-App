import React, { useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../contexts/ExportingContexts";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const sessionDuration = import.meta.env.VITE_SESSION_DURATION;
const RegisterPage = () => {
  const { email, setUserId } = useGlobalContext();
  const [cache, setCache] = useState("");
  const [formData, setFormData] = useState({
    email,
    username: "",
    hashTag: "",
    password: "",
    confirmPassword: "",
  });
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const checkUsernameAvailability = async (
    username: string,
    hashTag: string
  ) => {
    if (!username && !hashTag) {
      return;
    }
    try {
      const response = await axios.get(
        `${backendUrl}/auth/check-user?username=${username}&hashTag=${hashTag}`,
        { withCredentials: true }
      );
      if (response.status == 200) {
        setUsernameAvailable(true);
        setCache(`${username}#${hashTag}`);
      }
    } catch (error) {
      console.log(error);
      setUsernameAvailable(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (/\s/.test(value)) {
      alert("Spaces are not allowed!");
      return;
    }

    setFormData((prevData) => {
      const newData = {
        ...prevData,
        [name]: value,
      };
      if (
        newData.username &&
        newData.hashTag &&
        (name == "hashTag" && value.length == 4 ? true : false) &&
        cache !== `${newData.username}#${newData.hashTag}`
      ) {
        checkUsernameAvailability(newData.username, newData.hashTag);
      }
      return newData;
    });
  };
  const handleRegister = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!email || !formData.password || !formData.confirmPassword) {
      setError("Email, password and confirm password are required");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Password and confirm password should match");
      return;
    }
    setError("");
    try {
      const response = await axios.post(
        `${backendUrl}/auth/register`,
        formData,
        { withCredentials: true }
      );
      if (response.status == 201) {
        const { userId } = response.data.data;
        const sessionExpiry = Date.now() + Number(sessionDuration) || 0;
        setUserId(userId, sessionExpiry);
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
        <label htmlFor='username'>Username</label>
        <input
          type='text'
          name='username'
          value={formData.username}
          onChange={handleChange}
        />
        <label htmlFor='hashTag'>#</label>
        <input
          type='text'
          name='hashTag'
          id='hashTag'
          maxLength={4}
          minLength={4}
          style={{
            color:
              formData.hashTag.length < 4 || !usernameAvailable
                ? "red"
                : "green",
          }}
          value={formData.hashTag}
          onChange={handleChange}
        />

        {formData.username &&
          formData.hashTag &&
          formData.hashTag.length == 4 &&
          usernameAvailable == false && (
            <p style={{ color: "red" }}>Username unavailable. Try another</p>
          )}
        {formData.username && formData.hashTag && usernameAvailable == true && (
          <p style={{ color: "green" }}>username available.</p>
        )}

        <label htmlFor='password'>Password</label>
        <input
          type='password'
          name='password'
          disabled={!usernameAvailable}
          value={formData.password}
          onChange={handleChange}
        />
        <label htmlFor='confirmPassword'>Confirm password</label>
        <input
          type='password'
          name='confirmPassword'
          disabled={!usernameAvailable}
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <button
          type='submit'
          onClick={handleRegister}
          disabled={
            !formData.password ||
            !formData.confirmPassword ||
            !formData.username ||
            !formData.hashTag ||
            !usernameAvailable
          }
        >
          Register
        </button>
        <button type='button' onClick={() => navigate("/")}>
          Back
        </button>
      </form>
      {error && <p color='red'>{error}</p>}
    </div>
  );
};

export default RegisterPage;
