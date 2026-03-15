// frontend/src/views/app/VisualizarReceita.jsx
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import { Avatar } from '../../components/Avatar.jsx';
import { useVisualizarReceita } from "../../hooks/app/useVisualizarReceita";

export default function VisualizarReceita() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Consumindo toda a regra de negócio do nosso novo Hook!
  const { 
    receita, 
    carregando, 
    erro, 
    isFavorited, 
    favoriting, 
    toggleFavorite 
  } = useVisualizarReceita(id);

  // Early returns para loading e erro
  if (carregando) {
    return (
      <div className="min-h-screen w-screen overflow-x-hidden bg-purple-50 flex flex-col">
        <Header />
        <div className="flex-1 max-w-6xl w-full mx-auto p-6">
          <p className="text-gray-500 animate-pulse">Carregando receita...</p>
        </div>
      </div>
    );
  }

  if (erro || !receita) {
    return (
      <div className="min-h-screen w-screen overflow-x-hidden bg-purple-50 flex flex-col">
        <Header />
        <div className="flex-1 max-w-6xl w-full mx-auto p-6">
          <p className="text-red-500">{erro || "Receita não encontrada."}</p>
        </div>
      </div>
    );
  }

  // Lógica de UI (cálculo de URL da imagem de perfil)
  const urlDaFoto = receita?.usuario?.id 
    ? `${import.meta.env.VITE_SABOR_MATCH_BACKEND}/uploads/perfil/perfil_${receita.usuario.id}.png` 
    : '';

  // ==========================================
  // BLOCOS DE INTERFACE (Renderização Modular)
  // ==========================================
  const imagemEl = receita.imagem_path && (
    <img
      src={`${import.meta.env.VITE_SABOR_MATCH_BACKEND}/uploads/receitas/${receita.imagem_path}`}
      alt={receita.titulo}
      className="w-full h-64 md:h-80 object-cover mb-4 rounded-xl shadow-sm"
    />
  );

  const tituloEInfoEl = (
    <div className="relative mb-6 md:mb-0">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-purple-700 mb-4 leading-tight pr-14">
        {receita.titulo}
      </h1>
      <button
        onClick={toggleFavorite}
        disabled={favoriting}
        className={`absolute -top-2 -right-2 p-3 rounded-full transition shadow-md ${
          isFavorited
            ? 'bg-purple-800 text-white hover:bg-purple-700 hover:-translate-y-1 transition'
            : 'bg-white text-gray-700 hover:bg-gray-100 hover:-translate-y-1 transition'
        } disabled:opacity-50`}
        title={isFavorited ? 'Desfavoritar' : 'Favoritar'}
      >
        {favoriting ? '...' : isFavorited ? '💜' : '🤍'}
      </button>
      <div className="flex items-center gap-3 flex-wrap mb-6">
        <span className="text-purple-500 font-semibold">{receita.tempo_minutos} min</span>
        <span className="text-purple-500 font-semibold">·</span>
        <span className="text-purple-500 font-semibold">{receita.porcoes} porções</span>
      </div>
    </div>
  );

  const autorEl = receita.usuario && (
    <div className="bg-purple-50 rounded-lg p-4 mb-4 border border-purple-200">
      <p className="text-sm text-gray-600 mb-2">Publicado por</p>
      <Link
        to={user?.id === receita.usuario.id ? `/minha-conta` : `/perfil/${receita.usuario.id}`}
        className="flex items-center gap-3 hover:opacity-80 transition"
      >
        <Avatar
          src={urlDaFoto}
          alt={receita.usuario.nome}
          className="border-4 border-purple-100 w-12 h-12 rounded-full object-cover shadow-sm border border-white"
        />
        <span className="font-semibold text-gray-800 hover:text-purple-700">
          {receita.usuario.nome}
        </span>
      </Link>
    </div>
  );

  const ingredientesEl = (
    <div>
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">Ingredientes</h2>
      <ul className="list-disc list-inside space-y-2 pl-2">
        {receita.ingredientes.map((ing, index) => (
          <li key={index} className="text-gray-700">
            {ing.quantidade} {ing.unidade} de <span className="font-medium">{ing.nome}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const categoriasEl = receita.categorias && receita.categorias.length > 0 && (
    <div>
      <h2 className="text-2xl font-semibold text-purple-700 mt-2 mb-4">Categorias</h2>
      <div className="flex flex-wrap gap-2">
        {receita.categorias.map((nome) => (
          <span 
            key={nome} 
            onClick={() => navigate(`/buscar?q=${encodeURIComponent(nome)}`)} 
            className="cursor-pointer px-3 py-1 text-sm font-medium rounded-full border border-purple-200 bg-purple-100 text-purple-800 transition hover:-translate-y-1 hover:bg-purple-700 hover:text-white">
            {nome}
          </span>
        ))}
      </div>
    </div>
  );

  const preparoEl = (
    <div>
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">Modo de Preparo</h2>
      <div className="max-h-96 md:max-h-[500px] overflow-y-auto pr-2 border border-purple-100 rounded-lg p-5 bg-gray-50 shadow-inner">
        <p className="text-gray-700 whitespace-pre-line leading-relaxed">{receita.descricao}</p>
      </div>
    </div>
  );

  // ==========================================
  // RENDERIZAÇÃO RESPONSIVA PRINCIPAL
  // ==========================================
  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-purple-50 flex flex-col">
      <Header />
      <div className="pt-24 px-4 pb-4 sm:px-6 sm:pb-6 flex-1 max-w-6xl w-full mx-auto">
        <div className="p-4 sm:p-8 sm:bg-white sm:rounded-2xl sm:shadow-lg mb-8">
          
          <div className="flex flex-col md:grid md:grid-cols-2 gap-8">
            
            {/* === COLUNA ESQUERDA === */}
            <div className="flex flex-col gap-6">
              <div className="block md:hidden">{tituloEInfoEl}</div>
              {imagemEl}
              <div className="block md:hidden">{autorEl}</div>
              {ingredientesEl}
              <div className="hidden md:block">{categoriasEl}</div>
            </div>

            {/* === COLUNA DIREITA === */}
            <div className="flex flex-col md:gap-6">
              <div className="hidden md:block">
                {tituloEInfoEl}
                {autorEl}
              </div>
              <div className="mt-6 md:mt-0">{preparoEl}</div>
              <div className="block md:hidden mt-8">{categoriasEl}</div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}