import { Routes, Route } from "react-router-dom";
import Login from "./views/auth/Login.jsx";
import Register from "./views/auth/Register.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Home from "./views/app/Home.jsx";
import AuthWrapper from "./components/AuthWrapper.jsx";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Register />} />
        {/* Rotas protegidas */}
        <Route
          path="/"
          element={
            <AuthWrapper>
              <Home />
            </AuthWrapper>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
