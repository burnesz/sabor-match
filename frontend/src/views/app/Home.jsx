import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const { logout } = useAuth();
  const [receitas, setReceitas] = useState([]);
  const [recomendadas, setRecomendadas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Simulação de fetch para receitas gerais
        const res = await fetch("/api/receitas");
        const data = await res.json();
        setReceitas(data);

        // Simulação de fetch para recomendações do usuário
        const recRes = await fetch("/api/recomendacoes");
        const recData = await recRes.json();
        setRecomendadas(recData);

      } catch (err) {
        console.error("Erro ao carregar receitas:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-20">Carregando receitas...</p>;

  return (
    <div className="min-h-screen w-screen bg-purple-50">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-purple-600 text-white">
        <h1 className="text-2xl font-bold">Sabor Match</h1>
        <button
          onClick={logout}
          className="bg-purple-800 px-4 py-2 rounded-xl hover:bg-purple-700 transition"
        >
          Sair
        </button>
      </header>

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
