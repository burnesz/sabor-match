import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Ajuste o caminho conforme sua estrutura
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [termoBusca, setTermoBusca] = useState("");

  const handleBuscar = (e) => {
    e.preventDefault();
    if (termoBusca.trim().length >= 2) {
      navigate(`/buscar?q=${encodeURIComponent(termoBusca)}`);
    }
  };

  return (
    <header className="flex justify-between items-center p-6 bg-purple-600 text-white">
      <div className="flex gap-4 items-center">
        <h1 
          className="text-2xl font-bold cursor-pointer" 
          onClick={() => navigate('/')} 
          title="Página inicial"
        >
          Sabor Match
        </h1>
        <button
          onClick={() => navigate('/nova-receita')}
          className="px-3 py-2 bg-purple-800 hover:bg-purple-700 rounded-xl font-semibold hover:-translate-y-1 transition"
          title="Adicionar nova receita"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button
          onClick={() => navigate('/minha-conta')}
          className="px-3 py-2 bg-purple-800 hover:bg-purple-700 rounded-xl font-semibold hover:-translate-y-1 transition"
          title="Minha Conta"
        >
          <FontAwesomeIcon icon={faUser} />
        </button>
      </div>

      <div className="flex-grow max-w-lg mx-auto px-4">
        <form onSubmit={handleBuscar}>
          <input
            type="search"
            placeholder="Buscar receitas..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="w-full p-2 rounded-xl bg-purple-800 hover:bg-purple-700 focus:outline-none transition placeholder-purple-300 text-white"
          />
        </form>
      </div>

      <button
        onClick={logout}
        className="bg-purple-800 px-4 py-2 rounded-xl hover:bg-purple-700 hover:-translate-y-1 transition"
        title="Sair da conta"
      >
        <FontAwesomeIcon icon={faRightFromBracket} />
      </button>
    </header>
  );
}