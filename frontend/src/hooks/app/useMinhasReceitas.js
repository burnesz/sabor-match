import { useState, useEffect } from 'react';
import { listaReceitasCarrossel, listarReceitasFavoritas } from "../../api/receitas.js";

export function useMinhasReceitas(user) {
  const [minhasReceitas, setMinhasReceitas] = useState([]);
  const [receitasFavoritas, setReceitasFavoritas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const buscarReceitas = async () => {
      try {
        setCarregando(true);
        const [dataMinhas, dataFavoritas] = await Promise.all([
          listaReceitasCarrossel(),
          listarReceitasFavoritas()
        ]);
        setMinhasReceitas(dataMinhas);
        setReceitasFavoritas(dataFavoritas);
      } catch (error) {
        console.error("Erro na requisição:", error);
        setErro("Não foi possível carregar suas receitas.");
      } finally {
        setCarregando(false);
      }
    };

    if (user) {
      buscarReceitas();
    }
  }, [user]);

  return { minhasReceitas, receitasFavoritas, carregando, erro };
}