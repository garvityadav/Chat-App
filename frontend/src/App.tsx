import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import { UserProvider } from "./contexts/GlobalContext";
import { socket } from "./socket";
function App() {
  return;
  <UserProvider>
    <Router>
      <AppRoutes />
    </Router>
  </UserProvider>;
}

export default App;
