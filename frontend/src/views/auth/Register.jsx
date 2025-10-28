import React, { useState } from "react";
import { register } from "../../api/auth";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    try {
      await register(nome, email, password);
      setSuccess("Usuário cadastrado com sucesso!");
      setNome("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-purple-700 mb-6">
          Criar Conta
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Confirmar Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Botão */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            Cadastrar
          </button>
        </form>

        {/* Mensagens de erro e sucesso */}
        {error && (
          <p className="text-red-600 text-center mt-4">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-center mt-4">{success}</p>
        )}

        {/* Link para login */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Já tem conta?{" "}
          <a href="/" className="text-purple-600 font-medium hover:underline">
            Entrar
          </a>
        </p>
      </div>
    </div>
  );
}