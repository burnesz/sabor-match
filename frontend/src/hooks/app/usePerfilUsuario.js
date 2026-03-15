import { useState, useEffect } from 'react';
import { buscarPerfilUsuario } from '../../api/usuarios';

export function usePerfilUsuario(usuario_id) {
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarPerfil = async () => {
      // Reinicia os estados caso o ID mude
      setCarregando(true);
      setErro(null);

      try {
        const data = await buscarPerfilUsuario(usuario_id);
        setPerfil(data);
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        setErro("Não foi possível carregar o perfil do usuário");
      } finally {
        setCarregando(false);
      }
    };

    if (usuario_id) {
      carregarPerfil();
    }
  }, [usuario_id]);

  return { perfil, carregando, erro };
}