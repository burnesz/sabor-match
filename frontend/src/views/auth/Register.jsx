import React, { useState } from "react";
import { register } from "../../api/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    try {
      await register(nome, email, password);
      
      navigate('/login', { state: { tipo: "success", mensagem: "Usuário cadastrado com sucesso! Use suas credenciais para acessar." } })
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-purple-50 flex flex-col md:flex-row">
      
      {/* --- LADO ESQUERDO: Apresentação --- */}
      <div className="w-full md:w-1/2 bg-purple-600 flex flex-col justify-center px-8 py-8  md:p-16 lg:p-24 text-white">
        <div className="max-w-md mx-auto md:mx-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Junte-se a nós!
          </h1>
          <p className="text-lg md:text-xl text-purple-100 mb-8 leading-relaxed">
            Crie sua conta no Sabor Match para começar a salvar suas receitas favoritas.
          </p>
          
          <div className="hidden md:flex flex-col gap-4">
            <div className="flex items-center gap-3 bg-purple-800/30 p-4 rounded-2xl backdrop-blur-sm border border-purple-500/30">
              <span className="text-2xl">👨‍🍳</span>
              <p className="font-medium text-purple-50">Crie seu próprio livro de receitas digital</p>
            </div>
            <div className="flex items-center gap-3 bg-purple-800/30 p-4 rounded-2xl backdrop-blur-sm border border-purple-500/30">
              <span className="text-2xl">🌍</span>
              <p className="font-medium text-purple-50">Compartilhe suas ideias com a comunidade</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- LADO DIREITO: Formulário de Registro --- */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 relative -top-6 md:top-0">
        
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl md:shadow-none md:bg-transparent border border-gray-100 md:border-transparent">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Criar nova conta</h2>
            <p className="text-gray-500">Preencha os dados abaixo para começar.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Campo: Nome */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Nome
              </label>
              <input
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
                required
              />
            </div>

            {/* Campo: Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
                required
              />
            </div>

            {/* Campo: Senha e Confirmar Senha (Lado a Lado no Desktop) */}
            <div className="flex flex-col md:flex-row gap-5">
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
                  required
                />
              </div>
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {/* Mensagens de Feedback */}
            {error && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium text-center animate-fade-in">
                {error}
              </div>
            )}

            {/* Botão de Submit */}
            <button
              type="submit"
              className="w-full mt-2 bg-purple-600 text-white py-3 md:py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple-200 hover:bg-purple-700 hover:-translate-y-1 hover:shadow-xl transition-all active:scale-95"
            >
              Cadastrar
            </button>
          </form>

          {/* Rodapé do Formulário */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 font-medium">
              Já tem conta?{" "}
              {/* Ajustado para apontar para a sua rota "/" */}
              <a
                href="/"
                className="text-purple-600 font-bold hover:text-purple-800 hover:underline transition ml-1"
              >
                Entrar
              </a>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}