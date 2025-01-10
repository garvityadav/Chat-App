import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../contexts/GlobalContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function LandingPage() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const globalContext = useGlobalContext();
  if (!globalContext) {
    return <div>Error: User context is not available</div>;
  }
  const { setEmail, email } = globalContext;
  //checking if user exists
  const checkUserExists = async (email: string): Promise<boolean> => {
    try {
      console.log("inside check user exist");
      const response = await axios({
        method: "post",
        url: `${backendUrl}/api/v1/auth/check-user`,
        headers: {
          "Content-Type": "application/json",
        },
        data: { email },
        withCredentials: true,
      });
      console.log("response", response);
      if (!response) {
        setError("Error: User email not found, Please register");
        return false;
      }
      return true;
    } catch (error) {
      console.error("error checking user exist ", error);
      setError("Error: internal error in checking user exist");
      return false;
    }
  };

  //handling the next button
  const handleNext = async (e: React.FormEvent): Promise<void> => {
    //checking if user exist
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    setError("");
    try {
      const userExists = await checkUserExists(email);
      if (userExists) {
        navigate("/login");
      } else {
        navigate("/register");
      }
    } catch (error) {
      console.error("Error: in HandleNext", error);
      setError("Error: In handle next fun");
    }
  };
  return (
    <div>
      <form method='POST' onSubmit={handleNext} action=''>
        <h2>Welcome to chat App</h2>
        <>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type='submit' disabled={!email}>
            Next
          </button>
        </>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LandingPage;
