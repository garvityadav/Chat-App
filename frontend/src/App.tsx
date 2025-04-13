import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import { GlobalProvider } from "./contexts/GlobalContext";
import { SocketProvider } from "./contexts/SocketContext";
import ThemeProvider from "./contexts/ThemeContext";
import "../index.css";

function App() {
  return (
    <ThemeProvider>
      <GlobalProvider>
        <SocketProvider>
          <Router>
            <AppRoutes />
          </Router>
        </SocketProvider>
      </GlobalProvider>
    </ThemeProvider>
  );
}

export default App;
