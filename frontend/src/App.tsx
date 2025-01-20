import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import { GlobalProvider } from "./contexts/GlobalContext";
import { SocketProvider } from "./contexts/SocketContext";
// import { socket } from "./socket";
function App() {
  return (
    <GlobalProvider>
      <SocketProvider>
        <Router>
          <AppRoutes />
        </Router>
      </SocketProvider>
    </GlobalProvider>
  );
}

export default App;
