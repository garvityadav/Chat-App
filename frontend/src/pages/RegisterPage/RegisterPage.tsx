import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../contexts/ExportingContexts";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const sessionDuration = import.meta.env.VITE_SESSION_DURATION;
const RegisterPage = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email, navigate]);

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
      if (response.status == 201 || response.status == 200) {
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
    email && (
      <div>
        <div className='div-in-center'>
          <form className='form' method='POST' onSubmit={handleRegister}>
            <label className='.label-custom'>Email</label>
            <input type='text' disabled placeholder={email} />
            <label htmlFor='username'>Username</label>
            <div className='flex flex-row items-center'>
              <input
                type='text'
                maxLength={8}
                minLength={4}
                name='username'
                value={formData.username}
                onChange={handleChange}
              />
              <span>{8 - formData.username.length}</span>
            </div>
            <label htmlFor='hashTag'>#</label>
            <div className='flex flex-row item-center'>
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
              <span>{4 - formData.hashTag.length}</span>
            </div>

            {formData.username &&
              formData.hashTag &&
              formData.hashTag.length == 4 &&
              usernameAvailable == false && (
                <p style={{ color: "red" }}>
                  Username unavailable. Try another
                </p>
              )}
            {formData.username &&
              formData.hashTag &&
              usernameAvailable == true && (
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
              className='btn'
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
      </div>
    )
  );
};

export default RegisterPage;
