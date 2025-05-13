import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../contexts/ExportingContexts";
import { FilePen } from "lucide-react";

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
        <div className='min-h-screen flex items-center justify-center bg-gray-900 dark:bg-gray-900 px-4'>
          <div className='w-full max-w-md'>
            <div className='bg-gray-800 dar:bg-gray-800 shadow-2xl rounded-lg p-8 border border-gray-700'>
              <div className='text-center mb-6'>
                <FilePen className='mx-auto mb-4 text-blue-500' size={48} />
                <h2 className='text-2xl font-bold text-gray-100'>Register</h2>
              </div>

              <form
                className='space-y-4'
                method='POST'
                onSubmit={handleRegister}
              >
                {/* Email field */}
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  Email
                </label>
                <input
                  className='w-full px-3 py-2 
                           bg-gray-700 text-gray-300 
                           border border-gray-600 rounded-md 
                           cursor-not-allowed opacity-70'
                  type='text'
                  disabled
                  placeholder={email}
                />
                {/* Username field */}
                <label
                  className='block text-sm font-medium text-gray-300 mb-2'
                  htmlFor='username'
                >
                  Username
                </label>
                <div className='flex flex-row gap-2 items-center'>
                  <input
                    className='px-3 py-2 
                           bg-gray-700 text-gray-300 
                           border border-gray-600 rounded-md w-full 
                           opacity-70'
                    type='text'
                    maxLength={8}
                    minLength={4}
                    name='username'
                    placeholder='username'
                    value={formData.username}
                    onChange={handleChange}
                  />
                  <span className='text-sm font-medium text-gray-300 '>
                    {8 - formData.username.length}
                  </span>
                </div>
                <label
                  className='block text-sm font-medium text-gray-300 mb-2'
                  htmlFor='hashTag'
                >
                  Hashtag
                </label>
                <div className='flex flex-row items-center gap-2 '>
                  <input
                    className='px-3 py-2 
                           bg-gray-700 text-gray-300 
                           border border-gray-600 rounded-md w-full 
                           opacity-70'
                    type='text'
                    name='hashTag'
                    id='hashTag'
                    placeholder='hashtag'
                    maxLength={4}
                    minLength={4}
                    style={{
                      color:
                        formData.hashTag.length < 4 || !usernameAvailable
                          ? "gray"
                          : "green",
                    }}
                    value={formData.hashTag}
                    onChange={handleChange}
                  />
                  <span className='text-sm font-medium text-gray-300 '>
                    {4 - formData.hashTag.length}
                  </span>
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
                {/* Password field */}
                <label
                  className='block text-sm font-medium text-gray-300 mb-2'
                  htmlFor='password'
                >
                  Password
                </label>
                <input
                  className='px-3 py-2 
                           bg-gray-700 text-gray-300 
                           border border-gray-600 rounded-md w-full 
                           opacity-70'
                  type='password'
                  name='password'
                  disabled={!usernameAvailable}
                  value={formData.password}
                  onChange={handleChange}
                />
                <label
                  className='block text-sm font-medium text-gray-300 mb-2'
                  htmlFor='confirmPassword'
                >
                  Confirm password
                </label>
                <input
                  className='px-3 py-2 
                           bg-gray-700 text-gray-300 
                           border border-gray-600 rounded-md w-full 
                           opacity-70'
                  type='password'
                  name='confirmPassword'
                  disabled={!usernameAvailable}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {/* Action buttons */}
                <div className='grid grid-cols-2 gap-4'>
                  <button
                    className='w-full py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-md hover:bg-gray-600 transition duration-300'
                    type='button'
                    onClick={() => navigate("/")}
                  >
                    Back
                  </button>
                  <button
                    className='w-full py-2 bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition duration-300 border rounded-md  '
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
                </div>
              </form>
              {error && <p color='red'>{error}</p>}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default RegisterPage;
