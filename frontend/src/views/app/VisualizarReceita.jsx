import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from "../../components/Header";
import { obterReceita } from "../../api/receitas.js";

export default function VisualizarReceita() {
  const { id } = useParams();
  const [receita, setReceita] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const buscarReceita = async () => {
      try {
        const data = await obterReceita(id);
        setReceita(data);
      } catch (error) {
        console.error("Erro na requisição:", error);
        setErro("Não foi possível carregar a receita.");
      } finally {
        setCarregando(false);
      }
    };

    buscarReceita();
  }, [id]);

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
        <div className="bg-white rounded-2xl shadow p-6">
          {receita.imagem_path && (
            <img
              src={`http://localhost:8000/${receita.imagem_path}`}
              alt={receita.titulo}
              className="w-full h-64 object-cover rounded-xl mb-6"
            />
          )}
          <h1 className="text-3xl font-bold text-purple-700 mb-4">{receita.titulo}</h1>
          <p className="text-gray-600 mb-6">{receita.descricao}</p>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="bg-purple-100 rounded-lg px-4 py-2">
              <span className="font-semibold text-purple-700">Tempo:</span> {receita.tempo_minutos} min
            </div>
            <div className="bg-purple-100 rounded-lg px-4 py-2">
              <span className="font-semibold text-purple-700">Porções:</span> {receita.porcoes}
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-purple-700 mb-4">Ingredientes</h2>
            <ul className="list-disc list-inside space-y-2">
              {receita.ingredientes.map((ing, index) => (
                <li key={index} className="text-gray-700">
                  {ing.quantidade} {ing.unidade} de {ing.nome}
                </li>
              ))}
            </ul>
          </div>
          {receita.categorias.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-purple-700 mb-4">Categorias</h2>
              <div className="flex flex-wrap gap-2">
                {receita.categorias.map((catId) => (
                  <span key={catId} className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm">
                    Categoria {catId}
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