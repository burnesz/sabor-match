import { useState, useEffect } from 'react';
import { buscarReceitas } from "../../api/receitas.js";

export function useBuscarReceitas(termo) {
  const TAMANHO_PAGINA = 10;
  const [receitas, setReceitas] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalItens, setTotalItens] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  // Efeito 1: Sempre que o termo de pesquisa mudar, volta para a página 1
  useEffect(() => {
    setPaginaAtual(1);
  }, [termo]);

  // Efeito 2: Executa a busca na API sempre que o termo OU a página mudarem
  useEffect(() => {
    const buscar = async () => {
      // Validação inicial
      if (!termo || termo.trim().length < 2) {
        setErro("Digite no mínimo 2 caracteres para buscar");
        setReceitas([]);
        setTotalItens(0);
        setTotalPaginas(0);
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

    buscar();
  }, [termo, paginaAtual]);

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) {
      setPaginaAtual((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Adicionado scroll suave!
    }
  };

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas) {
      setPaginaAtual((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Adicionado scroll suave!
    }
  };

  return {
    receitas,
    paginaAtual,
    totalPaginas,
    totalItens,
    carregando,
    erro,
    handlePaginaAnterior,
    handleProximaPagina
  };
}