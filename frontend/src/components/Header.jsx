import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faRightFromBracket, 
  faUser, 
  faMagnifyingGlass, 
  faXmark 
} from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [termoBusca, setTermoBusca] = useState("");
  const [buscaAberta, setBuscaAberta] = useState(false);

  const handleBuscar = (e) => {
    e.preventDefault();
    if (termoBusca.trim().length >= 2) {
      navigate(`/buscar?q=${encodeURIComponent(termoBusca)}`);
      setBuscaAberta(false); // Fecha a busca no mobile após a pesquisa
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center p-4 md:p-6 bg-purple-600 text-white shadow-md">
      
      {/* Visualização Mobile com Busca Aberta */}
      {buscaAberta ? (
        <div className="flex w-full items-center gap-2 md:hidden animate-fade-in">
          <form onSubmit={handleBuscar} className="flex-grow">
            <input
              type="search"
              autoFocus
              placeholder="Buscar receitas..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full p-2 rounded-xl bg-purple-800 hover:bg-purple-700 focus:outline-none transition placeholder-purple-300 text-white"
            />
          </form>
          <button 
            onClick={() => setBuscaAberta(false)} 
            className="p-2 text-purple-200 hover:text-white transition"
          >
            <FontAwesomeIcon icon={faXmark} className="text-2xl" />
          </button>
        </div>
      ) : (
        <>
          {/* Lado Esquerdo: Logo e Botões Principais */}
          <div className="flex gap-2 md:gap-4 items-center">
            <h1 
              className="text-xl md:text-2xl font-bold cursor-pointer truncate" 
              onClick={() => navigate('/')} 
              title="Página inicial"
            >
              Sabor Match
            </h1>
            
            {/* Botões visíveis em telas maiores ou agrupados no mobile */}
            <button
              onClick={() => navigate('/nova-receita')}
              className="px-2 py-2 md:px-3 bg-purple-800 hover:bg-purple-700 rounded-xl font-semibold hover:-translate-y-1 transition"
              title="Adicionar nova receita"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button
              onClick={() => navigate('/minha-conta')}
              className="px-2 py-2 md:px-3 bg-purple-800 hover:bg-purple-700 rounded-xl font-semibold hover:-translate-y-1 transition"
              title="Minha Conta"
            >
              <FontAwesomeIcon icon={faUser} />
            </button>
          </div>

          {/* Barra de Busca - Desktop */}
          <div className="hidden md:block flex-grow max-w-lg mx-auto px-4">
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

          {/* Lado Direito: Busca Mobile e Logout */}
          <div className="flex gap-2 md:gap-4 items-center">
            {/* Botão de Lupa - Mobile */}
            <button
              onClick={() => setBuscaAberta(true)}
              className="md:hidden px-3 py-2 bg-purple-800 hover:bg-purple-700 rounded-xl transition"
              title="Buscar receitas"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>

            <button
              onClick={logout}
              className="bg-purple-800 px-3 py-2 md:px-4 rounded-xl hover:bg-purple-700 hover:-translate-y-1 transition"
              title="Sair da conta"
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
            </button>
          </div>
        </>
      )}
    </header>
  );
}