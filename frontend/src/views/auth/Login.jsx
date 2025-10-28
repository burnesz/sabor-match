import { useState } from "react";
import { login as apiLogin } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = await apiLogin(email, password);

      setSuccess("Login realizado com sucesso!");

      login(data.access_token);
      // Limpa campos
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-purple-700 mb-6">
          Sabor Match
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Mensagem de erro */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          {/* Botão */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            Entrar
          </button>
        </form>

        {/* Link de registro */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Não tem conta?{" "}
          <a
            href="/registrar"
            className="text-purple-600 font-medium hover:underline"
          >
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
}
