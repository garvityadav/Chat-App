import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../contexts/ExportingContexts";
import { getUser } from "../../utils/Storage";
import { useEffect } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function LandingPage() {
  const navigate = useNavigate();
  const globalContext = useGlobalContext();
  const setEmail = globalContext?.setEmail;
  const email = globalContext?.email;
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
      if (response.status == 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("error checking user exist ", error);
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
      }
    } catch (error) {
      console.error("Error: in HandleNext", error);
    }
  };
  return (
    !userId && (
      <div className='flex flex-row'>
        <div className='w-1/2'>SIDE PAGE</div>
        <div className='flex flex-col items-center justify-center w-1/2 h-screen bg-yellow-300'>
          <h1 className='block text-2xl text-black-299 '>Welcome</h1>
          <form className='form' method='POST' onSubmit={handleNext}>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              value={email || ""}
              placeholder='example@xyz.com'
              onChange={(e) => setEmail && setEmail(e.target.value)}
            />
            <button type='submit' disabled={!email}>
              Next
            </button>
          </form>
        </div>
      </div>
    )
  );
}

export default LandingPage;
