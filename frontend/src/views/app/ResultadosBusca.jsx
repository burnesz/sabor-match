import React, { useEffect, useState } from 'react';
import Header from "../../components/Header";
import { useSearchParams } from 'react-router-dom';
import { buscarReceitas } from "../../api/receitas.js";
import ReceitaCard from "../../components/ReceitaCard";

export default function ResultadosBusca() {
  const [searchParams] = useSearchParams();
  const termo = searchParams.get('q') || '';
  const [receitas, setReceitas] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalItens, setTotalItens] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const TAMANHO_PAGINA = 10;

  useEffect(() => {
    const buscar = async () => {
      if (!termo || termo.trim().length < 2) {
        setErro("Digite no mínimo 2 caracteres para buscar");
        setReceitas([]);
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);
        setErro(null);

        const resultado = await buscarReceitas(termo, paginaAtual, TAMANHO_PAGINA);

        setReceitas(resultado.items);
        setTotalPaginas(resultado.total_paginas);
        setTotalItens(resultado.total_itens);
      } catch (err) {
        console.error("Erro ao buscar receitas:", err);
        setErro("Erro ao buscar receitas");
        setReceitas([]);
      } finally {
        setCarregando(false);
      }
    };

    // Reset para página 1 quando o termo muda
    setPaginaAtual(1);
    buscar();
  }, [termo]);

  // Recarregar quando mudar de página
  useEffect(() => {
    if (!termo) return;

    const buscar = async () => {
      try {
        setCarregando(true);
        setErro(null);

        const resultado = await buscarReceitas(termo, paginaAtual, TAMANHO_PAGINA);

        setReceitas(resultado.items);
        setTotalPaginas(resultado.total_paginas);
        setTotalItens(resultado.total_itens);
      } catch (err) {
        console.error("Erro ao buscar receitas:", err);
        setErro("Erro ao buscar receitas");
      } finally {
        setCarregando(false);
      }
    };

    if (paginaAtual > 1) {
      buscar();
    }
  }, [paginaAtual, termo]);

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas) {
      setPaginaAtual(paginaAtual + 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-purple-50">
      <Header />
      <main className="p-6 max-w-6xl mx-auto">
        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-purple-700 mb-2">
                Resultados para "{termo}"
              </h2>
              {totalItens > 0 && (
                <p className="text-gray-600 text-sm">
                  {totalItens} receita{totalItens !== 1 ? 's' : ''} encontrada{totalItens !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          {carregando && (
            <div className="flex justify-center py-12">
              <div className="text-gray-500 animate-pulse">
                Buscando receitas...
              </div>
            </div>
          )}

          {erro && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{erro}</p>
            </div>
          )}

          {!carregando && !erro && receitas.length === 0 && termo !== '' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <p className="text-blue-600 text-lg">
                Nenhuma receita encontrada para "{termo}"
              </p>
              <p className="text-blue-500 text-sm mt-2">
                Tente ajustar sua busca ou verificar a ortografia
              </p>
            </div>
          )}

          {!carregando && !erro && receitas.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {receitas.map((r) => (
                  <ReceitaCard key={r.id} receita={r} />
                ))}
              </div>

              {/* Paginação */}
              {totalPaginas > 1 && (
                <div className="flex flex-col items-center gap-6 mt-10 mb-6">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={handlePaginaAnterior}
                      disabled={paginaAtual === 1 || carregando}
                      className={`px-6 py-2 rounded-lg font-medium transition ${
                        paginaAtual === 1 || carregando
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      ← Anterior
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 font-medium">
                        Página <strong>{paginaAtual}</strong> de <strong>{totalPaginas}</strong>
                      </span>
                    </div>

                    <button
                      onClick={handleProximaPagina}
                      disabled={paginaAtual >= totalPaginas || carregando}
                      className={`px-6 py-2 rounded-lg font-medium transition ${
                        paginaAtual >= totalPaginas || carregando
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      Próximo →
                    </button>
                  </div>

                  {/* Indicador visual de progresso */}
                  <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${(paginaAtual / totalPaginas) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
