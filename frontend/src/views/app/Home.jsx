import React, { useEffect, useRef, useState } from 'react';
import Header from "../../components/Header";
import { notify } from '../../utils/notification.js';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { listaReceitasRecentes, listaReceitasRecomendadas } from "../../api/receitas.js";

// initial static lists removed; data will be loaded via API

export default function Home() {
  const carrosselReceitasRef = useRef(null);
  const carrosselRecomendadasRef = useRef(null);
  const [receitas, setReceitas] = useState([]);
  const [recomendadas, setRecomendadas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
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

  useEffect(() => {
    const carregarFeed = async () => {
      try {
        const [rec, recs] = await Promise.all([
          listaReceitasRecentes(),
          listaReceitasRecomendadas(),
        ]);
        setReceitas(rec);
        setRecomendadas(recs);
      } catch (err) {
        console.error("Erro carregando feed:", err);
        setErro("Não foi possível carregar o feed");
      } finally {
        setCarregando(false);
      }
    };
    carregarFeed();
  }, []);

  const rolarEsquerda = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const rolarDireita = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen w-screen bg-purple-50">
      <Header />
      <main className="p-6 max-w-6xl mx-auto">
        {/* Receitas */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Receitas Recentes</h2>
          {carregando && <p className="text-gray-500">Carregando...</p>}
          {erro && <p className="text-red-500 mb-4">{erro}</p>}
          {!carregando && !erro && receitas.length === 0 && (
            <p className="text-gray-500">Nenhuma receita disponível.</p>
          )}
          {!carregando && !erro && receitas.length > 0 && (
            <div className="relative w-full group">
              <button 
                onClick={() => rolarEsquerda(carrosselReceitasRef)}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-md text-purple-700 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
                aria-label="Rolar para a esquerda"
              >
                ◀ 
              </button>

              <div 
                ref={carrosselReceitasRef}
                className="flex overflow-x-auto gap-6 pb-4 px-2 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {receitas.map((r) => (
                  <Link to={`/receita/${r.id}`} key={r.id} className="block bg-white rounded-2xl shadow p-4 flex-none w-64 sm:w-72 snap-start hover:shadow-lg transition">
                    <img
                      src={r.imagem_path ? `http://localhost:8000/${r.imagem_path}` : "https://via.placeholder.com/300x200"}
                      alt={r.titulo}
                      className="rounded-xl mb-2 w-full h-40 object-cover"
                    />
                    <h3 className="font-bold text-purple-700">{r.titulo}</h3>
                    <p className="text-sm text-gray-600">Tempo: {r.tempo_minutos} min</p>
                  </Link>
                ))}
              </div>

              <button 
                onClick={() => rolarDireita(carrosselReceitasRef)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-md text-purple-700 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
                aria-label="Rolar para a direita"
              >
                ▶
              </button>
            </div>
          )}
        </section>

        {/* Recomendações */}
        <section>
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Recomendações Para Você</h2>
          {!carregando && !erro && recomendadas.length === 0 && (
            <p className="text-gray-500">Sem recomendações no momento.</p>
          )}
          {!carregando && !erro && recomendadas.length > 0 && (
            <div className="relative w-full group">
              <button 
                onClick={() => rolarEsquerda(carrosselRecomendadasRef)}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-md text-purple-700 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
                aria-label="Rolar para a esquerda"
              >
                ◀ 
              </button>

              <div 
                ref={carrosselRecomendadasRef}
                className="flex overflow-x-auto gap-6 pb-4 px-2 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {recomendadas.map((r) => (
                  <Link to={`/receita/${r.id}`} key={r.id} className="block bg-white rounded-2xl shadow p-4 flex-none w-64 sm:w-72 snap-start border border-purple-200 hover:shadow-lg transition">
                    <img
                      src={r.imagem_path ? `http://localhost:8000/${r.imagem_path}` : "https://via.placeholder.com/300x200"}
                      alt={r.titulo}
                      className="rounded-xl mb-2 w-full h-40 object-cover"
                    />
                    <h3 className="font-bold text-purple-700">{r.titulo}</h3>
                    <p className="text-sm text-gray-600">Tempo: {r.tempo_minutos} min</p>
                  </Link>
                ))}
              </div>

              <button 
                onClick={() => rolarDireita(carrosselRecomendadasRef)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-md text-purple-700 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
                aria-label="Rolar para a direita"
              >
                ▶
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}