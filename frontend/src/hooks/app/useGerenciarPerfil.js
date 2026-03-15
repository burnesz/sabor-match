import { useState, useEffect, useRef } from 'react';
import { uploadImagemPerfil } from "../../api/uploads.js";
import { updateUser } from "../../api/auth.js";

export function useGerenciarPerfil(user, setUser) {
  const fileInputRef = useRef(null);
  const [fotoPerfil, setFotoPerfil] = useState('');
  const [fazendoUpload, setFazendoUpload] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nome: '', email: '' });
  const [updating, setUpdating] = useState(false);

  // Atualiza os dados iniciais quando o objeto user for carregado
  useEffect(() => {
    if (user) {
      setFotoPerfil(`${import.meta.env.VITE_SABOR_MATCH_API}/uploads/perfil/perfil_${user.id}.png`);
      setFormData({ nome: user.nome, email: user.email });
    }
  }, [user]);

  const dispararEscolhaDeArquivo = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadImagem = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Atualiza a interface instantaneamente para dar feedback ao usuário
    const previewUrl = URL.createObjectURL(file);
    setFotoPerfil(previewUrl);
  
    try {
      setFazendoUpload(true);
      await uploadImagemPerfil(file);
    } catch (error) {
      console.error("Erro no upload:", error);
    } finally {
      setFazendoUpload(false);
    }
  };

  const handleUpdateUser = async () => {
    try {
      setUpdating(true);
      const updatedUser = await updateUser(formData);
      setUser(updatedUser); 
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    } finally {
      setUpdating(false);
    }
  };

  return {
    fileInputRef,
    fotoPerfil,
    fazendoUpload,
    showModal,
    setShowModal,
    formData,
    setFormData,
    updating,
    dispararEscolhaDeArquivo,
    handleUploadImagem,
    handleUpdateUser
  };
}