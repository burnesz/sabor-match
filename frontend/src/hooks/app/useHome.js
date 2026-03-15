import { useState, useEffect } from 'react';
import { listaReceitasRecentes, listaReceitasRecomendadas } from "../../api/receitas.js";

export function useHome() {
  const [receitas, setReceitas] = useState([]);
  const [recomendadas, setRecomendadas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarFeed = async () => {
      setCarregando(true);
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

  return { receitas, recomendadas, carregando, erro };
}