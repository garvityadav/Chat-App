import { useState } from "react";
import axios from "axios";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

function LandingPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  //checking if user exists
  const checkUserExists = async (email: string): Promise<boolean> => {
    try {
      console.log("inside check user exist");
      const response = await axios({
        method: "post",
        url: "http://localhost:3030/api/v1/auth/check-user",
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
        setShowLogin(true);
        setShowRegister(false);
      } else {
        setShowRegister(true);
        setShowLogin(false);
      }
    } catch (error) {
      console.error("Error: in HandleNext", error);
      setError("Error: In handle next fun");
    }
  };
  if (showLogin) {
    return <LoginPage email={email} />;
  }
  if (showRegister) {
    return <RegisterPage email={email} />;
  }
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
