import React, { useEffect, useRef } from 'react';
import Header from "../../components/Header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

const receitasEstaticas = [
  {
    id: 1,
    titulo: "Lasanha Bolonhesa Clássica",
    tempo_preparo: 60,
    nota_media: 4.8,
    imagem_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 2,
    titulo: "Salmão Grelhado com Limão",
    tempo_preparo: 25,
    nota_media: 4.5,
    imagem_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 3,
    titulo: "Brownie de Chocolate Intenso",
    tempo_preparo: 45,
    nota_media: 4.9,
    imagem_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
];

const recomendadasEstaticas = [
  {
    id: 4,
    titulo: "Torta de Frango Cremosa",
    tempo_preparo: 50,
    nota_media: 4.2,
    imagem_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 5,
    titulo: "Sopa de Legumes da Vovó",
    tempo_preparo: 30,
    nota_media: 4.6,
    imagem_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
];



export default function MinhaConta() {
  const receitas = receitasEstaticas;
  const recomendadas = recomendadasEstaticas;

  return (
    <div className="min-h-screen w-screen bg-purple-50">
      <Header />
      <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center sticky top-6">
            
            {/* Foto de Perfil com Botão de Edição */}
            <div className="relative group mb-4">
              <div className="w-32 h-32 rounded-full border-4 border-purple-100 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Substituir pela foto do usuário
                  alt="Foto de perfil" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Botão "Bola" para editar foto */}
              <button className="absolute bottom-0 right-0 bg-purple-800 text-white p-2 rounded-xl hover:bg-purple-700 transition shadow-lg border-2 border-white" title="Alterar foto">
                <FontAwesomeIcon icon={faCamera} />
              </button>
            </div>

            {/* Nome do Usuário (Opcional, mas recomendado para contexto) */}
            <h2 className="text-xl font-bold text-gray-800">Seu Nome</h2>
            <p className="text-sm text-gray-500 mb-6">Membro desde 2024</p>

            {/* Botão Editar Dados Pessoais */}
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-purple-700 transition flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar Dados Pessoais
            </button>
          </div>
        </div>
        <main className="p-6 max-w-6xl mx-auto">
          {/* Receitas */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-purple-700 mb-4">Minhas Receitas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {receitas.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl shadow p-4">
                  <img
                    src={r.imagem_url || "https://via.placeholder.com/300x200"}
                    alt={r.titulo}
                    className="rounded-xl mb-2 w-full h-40 object-cover"
                  />
                  <h3 className="font-bold text-purple-700">{r.titulo}</h3>
                  <p className="text-sm text-gray-600">Tempo: {r.tempo_preparo} min</p>
                  <p className="text-sm text-yellow-500">⭐ {r.nota_media || "N/A"}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recomendações */}
          <section>
            <h2 className="text-xl font-semibold text-purple-700 mb-4">Receitas Salvas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recomendadas.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl shadow p-4 border border-purple-200">
                  <img
                    src={r.imagem_url || "https://via.placeholder.com/300x200"}
                    alt={r.titulo}
                    className="rounded-xl mb-2 w-full h-40 object-cover"
                  />
                  <h3 className="font-bold text-purple-700">{r.titulo}</h3>
                  <p className="text-sm text-gray-600">Tempo: {r.tempo_preparo} min</p>
                  <p className="text-sm text-yellow-500">⭐ {r.nota_media || "N/A"}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}