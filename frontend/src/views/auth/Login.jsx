import { useState } from "react";
import { login as apiLogin } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import { validateToken } from "../../api/auth";

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
      const userData = await validateToken(data.access_token);
      setSuccess("Login realizado com sucesso!");

      login(data.access_token, userData);
      // Limpa campos
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-purple-50 flex flex-col md:flex-row">
      
      {/* --- LADO ESQUERDO: Apresentação (Desktop) e Header (Mobile) --- */}
      <div className="w-full md:w-1/2 bg-purple-600 flex flex-col justify-center px-8 py-8 md:p-16 lg:p-24 text-white">
        <div className="max-w-md mx-auto md:mx-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Sabor Match
          </h1>
          <p className="text-lg md:text-xl text-purple-100 mb-4 leading-relaxed">
            Sua plataforma para explorar, salvar e compartilhar as melhores receitas. 
            Encontre o prato perfeito para o seu momento.
          </p>
          
          {/* Oculta os "features" no celular para poupar espaço */}
          <div className="hidden md:flex flex-col gap-4">
            <div className="flex items-center gap-3 bg-purple-800/30 p-4 rounded-2xl backdrop-blur-sm border border-purple-500/30">
              <span className="text-2xl">🍳</span>
              <p className="font-medium text-purple-50">Descubra novos sabores todos os dias</p>
            </div>
            <div className="flex items-center gap-3 bg-purple-800/30 p-4 rounded-2xl backdrop-blur-sm border border-purple-500/30">
              <span className="text-2xl">❤️</span>
              <p className="font-medium text-purple-50">Guarde suas receitas favoritas</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- LADO DIREITO: Formulário de Login --- */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 relative -top-6 md:top-0">
        
        {/* O formulário "sobe" um pouquinho no mobile para sobrepor o fundo roxo */}
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl md:shadow-none md:bg-transparent border border-gray-100 md:border-transparent">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo de volta!</h2>
            <p className="text-gray-500">Faça login para acessar sua cozinha digital.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Campo: Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
                required
              />
            </div>

            {/* Campo: Senha */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Senha
                </label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
                required
              />
            </div>

            {/* Mensagens de Feedback */}
            {error && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium text-center animate-fade-in">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 text-green-600 border border-green-100 rounded-xl text-sm font-medium text-center animate-fade-in">
                {success}
              </div>
            )}

            {/* Botão de Submit */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 md:py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple-200 hover:bg-purple-700 hover:-translate-y-1 hover:shadow-xl transition-all active:scale-95"
            >
              Entrar na conta
            </button>
          </form>

          {/* Rodapé do Formulário */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 font-medium">
              Ainda não tem uma conta?{" "}
              <a
                href="/registrar"
                className="text-purple-600 font-bold hover:text-purple-800 hover:underline transition ml-1"
              >
                Cadastre-se grátis
              </a>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}