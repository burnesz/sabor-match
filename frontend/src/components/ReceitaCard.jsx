import React from 'react';
import { Link } from 'react-router-dom';

const ReceitaCard = ({ receita }) => {
  const categoriaPrincipal = receita.categorias?.[0];

  return (
    <Link
      to={`/receita/${receita.id}`}
      className="bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-purple-900/10 transition-all duration-300 w-72 h-[340px] flex-shrink-0 flex flex-col border border-purple-100 group"
    >
      <div className="relative h-44 w-full flex-shrink-0 bg-purple-50 overflow-hidden">
        <img
          src={`${import.meta.env.VITE_SABOR_MATCH_API}/uploads/receitas/${receita.imagem_path}`}
          alt={receita.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {categoriaPrincipal && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-purple-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {categoriaPrincipal}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-purple-800 text-lg leading-tight mb-1 line-clamp-2">
          {receita.titulo}
        </h3>
        
        <p className="text-sm text-gray-500 mb-3">
          por <span className="font-medium text-gray-800">{receita.usuario?.nome || 'Anônimo'}</span>
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-purple-100">
          
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-purple-800 font-semibold">Tempo</span>
            <span className="text-sm font-medium text-gray-800">{receita.tempo_minutos} min</span>
          </div>
          <div className="w-px h-6 bg-purple-100"></div> 

          <div className="flex flex-col items-center">
            <span className="text-[11px] uppercase tracking-wider text-purple-800 font-semibold">Porções</span>
            <span className="text-sm font-medium text-gray-800">{receita.porcoes}</span>
          </div>

          <div className="w-px h-6 bg-purple-100"></div>

          <div className="flex flex-col items-end">
            <span className="text-[11px] uppercase tracking-wider text-purple-800 font-semibold">Itens</span>
            <span className="text-sm font-medium text-gray-800">{receita.ingredientes?.length || 0}</span>
          </div>
          
        </div>
      </div>
    </Link>
  );
};

export default ReceitaCard; 