import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from "../../components/Header";
import ReceitaCard from "../../components/ReceitaCard";

export default function PerfilUsuario() {
  const { usuario_id } = useParams();
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const buscarPerfil = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/receitas/usuario/${usuario_id}/perfil`
        );
        if (!response.ok) {
          throw new Error("Usuário não encontrado");
        }
        const data = await response.json();
        setPerfil(data);
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        setErro("Não foi possível carregar o perfil do usuário");
      } finally {
        setCarregando(false);
      }
    };

    buscarPerfil();
  }, [usuario_id]);

  if (carregando) {
    return (
      <div className="h-screen w-screen overflow-x-hidden bg-purple-50">
        <Header />
        <div className="max-w-6xl mx-auto p-6">
          <p className="text-gray-500">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="h-screen w-screen overflow-x-hidden bg-purple-50">
        <Header />
        <div className="max-w-6xl mx-auto p-6">
          <p className="text-red-500">{erro}</p>
        </div>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="h-screen w-screen overflow-x-hidden bg-purple-50">
        <Header />
        <div className="max-w-6xl mx-auto p-6">
          <p className="text-gray-500">Perfil não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-x-hidden bg-purple-50">
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        {/* Cabeçalho do Perfil */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-6 mb-6">
            <img
              src= {`http://localhost:8000/uploads/perfil/perfil_${perfil.usuario.id}.png`}
              alt={perfil.usuario.nome}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h1 className="text-4xl font-extrabold text-purple-700 mb-2">
                {perfil.usuario.nome}
              </h1>
              <p className="text-gray-600">
                {perfil.total_receitas} receita{perfil.total_receitas !== 1 ? 's' : ''} publicada{perfil.total_receitas !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Receitas do Usuário */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-purple-700 mb-6">
            Receitas de {perfil.usuario.nome}
          </h2>

          {perfil.receitas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Este usuário ainda não publicou receitas
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {perfil.receitas.map((receita) => (
                <ReceitaCard receita={receita} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
