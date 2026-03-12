
import React from 'react';
import { Link } from 'react-router-dom';

const ReceitaCard = ({ receita }) => {
  return (
    <Link
      to={`/receita/${receita.id}`}
      key={receita.id}
      className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition duration-300"
    >
      <div className="relative h-40 bg-gray-200 overflow-hidden">
        <img
          src={receita.imagem_path ? `http://localhost:8000/${receita.imagem_path}` : "https://via.placeholder.com/300x200"}
          alt={receita.titulo}
          className="w-full h-full object-cover hover:scale-105 transition duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
          {receita.titulo}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Tempo: {receita.tempo_minutos} min</span>
        </div>
      </div>
    </Link>
  );
};

export default ReceitaCard;
