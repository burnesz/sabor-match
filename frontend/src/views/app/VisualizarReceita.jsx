import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from "../../components/Header";
import { obterReceita, verificarFavorita, favoritarReceita, desfavoritarReceita } from "../../api/receitas.js";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function VisualizarReceita() {
  const { id } = useParams();
  const [receita, setReceita] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriting, setFavoriting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const buscarReceita = async () => {
      try {
        const [dataReceita, dataFavorita] = await Promise.all([
          obterReceita(id),
          verificarFavorita(id)
        ]);
        setReceita(dataReceita);
        setIsFavorited(dataFavorita.favoritada);
      } catch (error) {
        console.error("Erro na requisição:", error);
        setErro("Não foi possível carregar a receita.");
      } finally {
        setCarregando(false);
      }
    };

    buscarReceita();
  }, [id]);

  const toggleFavorite = async () => {
    try {
      setFavoriting(true);
      if (isFavorited) {
        await desfavoritarReceita(id);
        setIsFavorited(false);
      } else {
        await favoritarReceita(id);
        setIsFavorited(true);
      }
    } catch (error) {
      console.error("Erro ao alterar favorito:", error);
    } finally {
      setFavoriting(false);
    }
  };

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

  const imagemEl = receita.imagem_path && (
    <img
      src={import.meta.env.VITE_SABOR_MATCH_BACKEND + receita.imagem_path}
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
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        } disabled:opacity-50`}
        title={isFavorited ? 'Desfavoritar' : 'Favoritar'}
      >
        {favoriting ? '...' : isFavorited ? '❤️' : '🤍'}
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
        <img
          src={import.meta.env.VITE_SABOR_MATCH_BACKEND + "/uploads/perfil/perfil_" + receita.usuario.id + ".png"}
          alt={receita.usuario.nome}
          className="w-12 h-12 rounded-full object-cover shadow-sm border border-white"
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

  // --- 2. Renderização Responsiva ---
  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-purple-50 flex flex-col">
      <Header />
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        <div className="p-4 sm:p-8 sm:bg-white sm:rounded-2xl sm:shadow-lg mb-8">
          
          <div className="flex flex-col md:grid md:grid-cols-2 gap-8">
            
            {/* === COLUNA ESQUERDA === */}
            <div className="flex flex-col gap-6">
              
              {/* Visível APENAS no Mobile: Título e Info vão pro topo */}
              <div className="block md:hidden">
                {tituloEInfoEl}
              </div>

              {/* Imagem (Fica no lugar natural na coluna esquerda pro Desktop, mas encaixa perfeito depois do título no Mobile) */}
              {imagemEl}

              {/* Visível APENAS no Mobile: Autor logo após a imagem */}
              <div className="block md:hidden">
                {autorEl}
              </div>

              {/* Ingredientes (Padrão nos dois) */}
              {ingredientesEl}

              {/* Visível APENAS no Desktop: Categorias ficam no final da coluna esquerda */}
              <div className="hidden md:block">
                {categoriasEl}
              </div>
            </div>

            {/* === COLUNA DIREITA === */}
            <div className="flex flex-col md:gap-6">
              
              {/* Visível APENAS no Desktop: Título, Info e Autor ficam na direita */}
              <div className="hidden md:block">
                {tituloEInfoEl}
                {autorEl}
              </div>

              {/* Modo de Preparo */}
              <div className="mt-6 md:mt-0">
                {preparoEl}
              </div>

              {/* Visível APENAS no Mobile: Categorias vão para o final da tela */}
              <div className="block md:hidden mt-8">
                {categoriasEl}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}