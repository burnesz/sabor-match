import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import AuthWrapper from "./components/AuthWrapper.jsx";
import Login from "./views/auth/Login";
import Register from "./views/auth/Register";
import Home from "./views/app/Home.jsx";
import NovaReceita from "./views/app/NovaReceita.jsx";
import MinhaConta from "./views/app/MinhaConta.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <AuthProvider>
      <ToastContainer />
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
        <Route
          path="/minha-conta"
          element={
            <AuthWrapper>
              <MinhaConta />
            </AuthWrapper>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
