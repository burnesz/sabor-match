// frontend/src/views/app/Home.jsx
import React, { useRef } from 'react';
import Header from "../../components/Header";
import ReceitaCard from "../../components/ReceitaCard";
import { useHome } from '../../hooks/app/useHome';
import { useFlashMessage } from '../../hooks/app/useFlashMessage';

export default function Home() {
  useFlashMessage();
  const { receitas, recomendadas, carregando, erro } = useHome();

  // 2. Refs e Funções exclusivas da Interface (UI)
  const carrosselReceitasRef = useRef(null);
  const carrosselRecomendadasRef = useRef(null);

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

  // 3. Renderização
  return (
    <div className="min-h-screen w-screen bg-purple-50">
      <Header />
      <main className="pt-24 max-w-6xl mx-auto">
        <div className="p-4 sm:p-8 sm:bg-white sm:rounded-2xl sm:shadow-lg mb-8">
          
          {/* Receitas Recentes */}
          <section className="w-full max-w-full min-w-0 mb-10">
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
                  className="flex overflow-x-auto gap-6 pb-4 px-2 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-proximity"
                >
                  {receitas.map((r) => (
                    <ReceitaCard key={r.id} receita={r} />
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
            
            {carregando && <p className="text-gray-500">Carregando...</p>}
            {/* Omitido erro propositalmente para não poluir a tela duas vezes com a mesma mensagem caso a API falhe */}
            
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
                  className="flex overflow-x-auto gap-6 pb-4 px-2 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-proximity"
                >
                  {recomendadas.map((r) => (
                    <ReceitaCard key={r.id} receita={r} />
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

        </div>
      </main>
    </div>
  );
}