// frontend/src/views/app/PerfilUsuario.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from "../../components/Header";
import ReceitaCard from "../../components/ReceitaCard";
import { usePerfilUsuario } from "../../hooks/app/usePerfilUsuario";
import { Avatar } from "../../components/Avatar";

export default function PerfilUsuario() {
  const { usuario_id } = useParams();
  const { perfil, carregando, erro } = usePerfilUsuario(usuario_id);
  const urlDaFoto = perfil?.usuario?.id 
  ? `${import.meta.env.VITE_SABOR_MATCH_BACKEND}/uploads/perfil/perfil_${perfil.usuario.id}.png` 
  : '';
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
      <div className="pt-24 max-w-6xl mx-auto p-6">
        {/* Cabeçalho do Perfil */}
        <div className="p-4 sm:p-8 sm:bg-white sm:rounded-2xl sm:shadow-lg mb-8">
          <div className="flex items-center gap-6 mb-6">
          <Avatar 
            src={urlDaFoto} 
            alt={perfil.usuario.nome} 
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
        <div className="p-4 sm:p-8 sm:bg-white sm:rounded-2xl sm:shadow-lg mb-8">
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
                // Lembre-se sempre de passar a 'key' ao usar map em componentes React!
                <ReceitaCard key={receita.id} receita={receita} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}