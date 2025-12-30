import React, { useEffect, useRef } from 'react';
import Header from "../../components/Header";
import { notify } from '../../utils/notification.js';
import { useLocation, useNavigate } from 'react-router-dom';

const receitasEstaticas = [
  {
    id: 1,
    titulo: "Lasanha Bolonhesa Clássica",
    tempo_preparo: 60,
    nota_media: 4.8,
    imagem_url: "https://images.unsplash.com/photo-1627993077671-8b2111d4d03d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
    imagem_url: "https://images.unsplash.com/photo-1598918239088-b223ff93b584?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
];

const recomendadasEstaticas = [
  {
    id: 4,
    titulo: "Torta de Frango Cremosa",
    tempo_preparo: 50,
    nota_media: 4.2,
    imagem_url: "https://images.unsplash.com/photo-1579270634676-e1751d3b2b8e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 5,
    titulo: "Sopa de Legumes da Vovó",
    tempo_preparo: 30,
    nota_media: 4.6,
    imagem_url: "https://images.unsplash.com/photo-1555986161-fd2339343057?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
];



export default function Home() {
  const receitas = receitasEstaticas;
  const recomendadas = recomendadasEstaticas;
  const location = useLocation();
  const navigate = useNavigate();
  const jaNotificou = useRef(false);

  useEffect(() => {
    if (location.state && location.state.mensagem) {
      if (jaNotificou.current) return;
      
      const { mensagem, tipo } = location.state;

      if (tipo === 'error') notify.error(mensagem);
      else if (tipo === 'warn') notify.warn(mensagem);
      else notify.success(mensagem);

      jaNotificou.current = true;

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen w-screen bg-purple-50">
      <Header />
      <main className="p-6 max-w-6xl mx-auto">
        {/* Receitas */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Receitas Recentes</h2>
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
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Recomendações Para Você</h2>
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
  );
}