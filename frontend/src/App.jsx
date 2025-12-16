import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import AuthWrapper from "./components/AuthWrapper.jsx";
import Login from "./views/auth/Login.jsx";
import Register from "./views/auth/Register.jsx";
import Home from "./views/app/Home.jsx";
import NovaReceita from "./views/app/NovaReceita.jsx";


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
        <Route
          path="/nova-receita"
          element={
            <AuthWrapper>
              <NovaReceita />
            </AuthWrapper>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
