import { useState, useEffect } from 'react';
import { obterReceita, verificarFavorita, favoritarReceita, desfavoritarReceita } from "../../api/receitas.js";

export function useVisualizarReceita(id) {
  const [receita, setReceita] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriting, setFavoriting] = useState(false);

  // Efeito para carregar a receita e o status de favorito
  useEffect(() => {
    const buscarReceita = async () => {
      try {
        setCarregando(true);
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

    if (id) {
      buscarReceita();
    }
  }, [id]);

  // Função para alternar o status de favorito
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

  return {
    receita,
    carregando,
    erro,
    isFavorited,
    favoriting,
    toggleFavorite
  };
}