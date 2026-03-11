import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from "../../components/Header";
import { obterReceita, verificarFavorita, favoritarReceita, desfavoritarReceita } from "../../api/receitas.js";

export default function VisualizarReceita() {
  const { id } = useParams();
  const [receita, setReceita] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriting, setFavoriting] = useState(false);

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
      <div className="h-screen w-screen overflow-x-hidden bg-purple-50">
        <Header />
        <div className="max-w-6xl mx-auto p-6">
          <p className="text-gray-500">Carregando receita...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="h-screen w-screen overflow-x-hidden bg-purple-50">
        <Header />
        <div className="max-w-6xl mx-auto p-6">
          <p className="text-red-500">{erro}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-x-hidden bg-purple-50">
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="md:grid md:grid-cols-2 md:gap-8">
            {receita.imagem_path && (
              <img
                src={`http://localhost:8000/${receita.imagem_path}`}
                alt={receita.titulo}
                className="w-full h-64 md:h-auto object-cover rounded-xl mb-6 md:mb-0"
              />
            )}

            <div className="flex flex-col justify-between">
              <div className="relative">
                <h1 className="text-4xl font-extrabold text-purple-700 mb-4 leading-tight">{receita.titulo}</h1>
                <button
                  onClick={toggleFavorite}
                  disabled={favoriting}
                  className={`absolute -top-2 -right-2 p-2 rounded-full transition shadow-lg ${
                    isFavorited
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  } disabled:opacity-50`}
                  title={isFavorited ? 'Desfavoritar' : 'Favoritar'}
                >
                  {favoriting ? '...' : (isFavorited ? '❤️' : '🤍')}
                </button>
                <div className="flex items-center mb-4 gap-3 flex-wrap">
                  <span className="text-purple-500 font-semibold">{receita.tempo_minutos} min</span>
                  <span className="text-purple-500 font-semibold">·</span>
                  <span className="text-purple-500 font-semibold">{receita.porcoes} porções</span>
                </div>
                <p className="text-gray-600 mb-6 whitespace-pre-line">{receita.descricao}</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">Ingredientes</h2>
            <ul className="list-disc list-inside space-y-2 pl-4">
              {receita.ingredientes.map((ing, index) => (
                <li key={index} className="text-gray-700">
                  {ing.quantidade} {ing.unidade} de <span className="font-medium">{ing.nome}</span>
                </li>
              ))}
            </ul>
          </div>

          {receita.categorias.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-purple-700 mb-4">Categorias</h2>
              <div className="flex flex-wrap gap-2">
                {receita.categorias.map((nome) => (
                  <span key={nome} className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {nome}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}