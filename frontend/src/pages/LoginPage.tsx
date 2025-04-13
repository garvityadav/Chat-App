import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../contexts/ExportingContexts";
import { Eye, EyeOff, Lock } from "lucide-react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const sessionDuration = import.meta.env.VITE_SESSION_DURATION;

function LoginPage() {
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { email, setUserId } = useGlobalContext();
  const navigate = useNavigate();

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email, navigate]);

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await axios({
        method: "post",
        url: `${backendUrl}/auth/login`,
        data: { email, password },
        withCredentials: true,
      });

      // Successful login
      if (response.data.status === 200) {
        const { userId } = response.data.data;
        const sessionExpiry = Date.now() + parseInt(sessionDuration);
        setUserId(userId, sessionExpiry);
        navigate("/main");
      }
    } catch (error) {
      console.error("Login error", error);
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        setError(
          status === 401
            ? "Invalid password"
            : "An error occurred. Please try again."
        );
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  if (!email) return null;

  return (
    <div
      className='min-h-screen flex items-center justify-center 
                    bg-gray-900 dark:bg-gray-900 px-4'
    >
      <div className='w-full max-w-md'>
        <div
          className='bg-gray-800 dark:bg-gray-800 
                        shadow-2xl rounded-lg p-8 
                        border border-gray-700'
        >
          <div className='text-center mb-6'>
            <Lock className='mx-auto mb-4 text-blue-500' size={48} />
            <h2 className='text-2xl font-bold text-gray-100'>Login</h2>
          </div>

          <form onSubmit={handleLogin} className='space-y-4'>
            {/* Email Field */}
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-300 mb-2'
              >
                Email
              </label>
              <input
                type='email'
                value={email}
                disabled
                className='w-full px-3 py-2 
                           bg-gray-700 text-gray-300 
                           border border-gray-600 rounded-md 
                           cursor-not-allowed opacity-70'
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-300 mb-2'
              >
                Password
              </label>
              <div className='relative'>
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Enter your password'
                  className='w-full px-3 py-2 
                             bg-gray-700 text-gray-100 
                             border border-gray-600 rounded-md 
                             pr-10 focus:outline-none 
                             focus:ring-2 focus:ring-blue-500'
                />
                <button
                  type='button'
                  onClick={togglePasswordVisibility}
                  className='absolute inset-y-0 right-0 px-3 flex items-center'
                >
                  {isPasswordVisible ? (
                    <EyeOff className='text-gray-400' size={20} />
                  ) : (
                    <Eye className='text-gray-400' size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className='text-red-400 text-sm text-center'>{error}</div>
            )}

            {/* Action Buttons */}
            <div className='grid grid-cols-2 gap-4'>
              <button
                type='button'
                onClick={() => navigate("/")}
                className='w-full py-2 
                           bg-gray-700 text-gray-300 
                           border border-gray-600 rounded-md 
                           hover:bg-gray-600 
                           transition duration-300'
              >
                Back
              </button>
              <button
                type='submit'
                disabled={!password || isLoading}
                className='w-full py-2 
                           bg-blue-600 text-white 
                           rounded-md 
                           hover:bg-blue-700 
                           transition duration-300 
                           disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          {/* Optional: Forgot Password Link */}
          <div className='text-center mt-4'>
            <a
              href='/forgot-password'
              className='text-sm text-blue-400 hover:underline'
            >
              Forgot Password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
