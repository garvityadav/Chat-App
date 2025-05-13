import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/Storage";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../contexts/ExportingContexts";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function LandingPage() {
  const navigate = useNavigate();
  const globalContext = useGlobalContext();
  const setEmail = globalContext?.setEmail;
  const email = globalContext?.email;
  const [error, setError] = useState<string>("");
  const userId = getUser();
  //checking if user exists
  useEffect(() => {
    if (userId) {
      navigate("/main");
    }
  });
  const checkUserExists = async (email: string): Promise<boolean> => {
    try {
      const response = await axios.get(
        `${backendUrl}/auth/check-user?email=${email}`,
        { withCredentials: true }
      );
      return response.status == 200;
    } catch (error) {
      console.error("error checking user exist ", error);
      setError("Unable to verify email. Please try again.");
      return false;
    }
  };

  //handling the next button
  const handleNext = async (e: React.FormEvent): Promise<void> => {
    //checking if user exist
    e.preventDefault();

    try {
      if (email) {
        const userExists = await checkUserExists(email);
        if (userExists) {
          navigate("/login");
        } else {
          navigate("/register");
        }
      } else {
        setError("Please enter a valid email address");
      }
    } catch (error) {
      console.error("Error: in HandleNext", error);
      setError("An unexpected error occurred");
    }
  };
  return (
    !userId && (
      <div className='min-h-screen flex'>
        {/* Left Side - Optional Branding/Image */}
        <div className='hidden md:block md:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600'>
          <div className='flex items-center justify-center h-full text-white text-center p-8'>
            <div>
              <h2 className='text-4xl font-bold mb-4'>Welcome to Chat App</h2>
              <p className='text-xl'>Connect, Chat, Communicate</p>
            </div>
          </div>
        </div>

        {/* Right Side - Email Input */}
        <div className='w-full md:w-1/2 flex items-center justify-center bg-gray-100 p-8'>
          <div className='w-full max-w-md bg-white shadow-md rounded-lg p-8'>
            <h1 className='text-3xl font-bold text-center mb-6 text-gray-800'>
              Get Started
            </h1>

            <form onSubmit={handleNext} className='space-y-4'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Email Address
                </label>
                <input
                  type='email'
                  id='email'
                  value={email || ""}
                  onChange={(e) => setEmail && setEmail(e.target.value)}
                  placeholder='Enter your email'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 
                             transition duration-300'
                  required
                />
              </div>

              {error && (
                <div className='text-red-500 text-sm text-center'>{error}</div>
              )}

              <button
                type='submit'
                disabled={!email}
                className='w-full bg-blue-500 text-white py-2 rounded-md 
                           hover:bg-blue-600 transition duration-300 
                           disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Continue
              </button>
            </form>

            <div className='mt-4 text-center text-sm text-gray-600'>
              By continuing, you agree to our
              <a href='/terms' className='text-blue-500 ml-1 hover:underline'>
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default LandingPage;
