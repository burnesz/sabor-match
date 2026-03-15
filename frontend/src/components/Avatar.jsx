import { useState } from 'react';

export function Avatar({ 
  src, 
  alt, 
  fallbackSrc = '/perfil.png', // Caminho padrão caso a imagem falhe
  className = "w-24 h-24 rounded-full object-cover border-4 border-purple-100" // Estilos padrão do Tailwind
}) {
  const [erroNaImagem, setErroNaImagem] = useState(false);

  return (
    <img
      src={erroNaImagem ? fallbackSrc : src}
      alt={alt}
      className={className}
      onError={() => setErroNaImagem(true)}
    />
  );
}