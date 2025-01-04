import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import dotenv from "dotenv";
dotenv.config();
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
