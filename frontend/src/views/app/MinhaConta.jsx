import React, { useEffect, useRef, useState } from 'react'; // Adicionado o useState aqui
import Header from "../../components/Header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { listaReceitasCarrossel, listarReceitasFavoritas } from "../../api/receitas.js";
import { useAuth } from "../../context/AuthContext";
import { uploadImagemPerfil } from "../../api/uploads.js";
import { Link } from 'react-router-dom';
import { updateUser } from "../../api/auth.js";

export default function MinhaConta() {
  const carrosselRef = useRef(null);
  const [minhasReceitas, setMinhasReceitas] = useState([]);
  const [receitasFavoritas, setReceitasFavoritas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);
  const [fotoPerfil, setFotoPerfil] = useState('');
  const [fazendoUpload, setFazendoUpload] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nome: '', email: '' });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setFotoPerfil(`http://127.0.0.1:8000/uploads/perfil/perfil_${user.id}.png`);
      setFormData({ nome: user.nome, email: user.email });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="h-screen w-screen overflow-x-hidden bg-purple-50">
        <Header />
        <div className="max-w-6xl mx-auto p-6">
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const buscarReceitas = async () => {
      try {
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

    buscarReceitas();
  }, []);

  const dispararEscolhaDeArquivo = () => {
  // Simula um clique no input de arquivo invisível
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadImagem = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // 1. Cria um preview local rápido para o usuário não ficar esperando
  const previewUrl = URL.createObjectURL(file);
  setFotoPerfil(previewUrl);
  
  try {
    setFazendoUpload(true);
    const response = await uploadImagemPerfil(file);
    console.log("Upload bem-sucedido:", response);
  } catch (error) {
    console.error("Erro no upload:", error);
  } finally {
    setFazendoUpload(false);
  }
  }

  const handleUpdateUser = async () => {
    try {
      setUpdating(true);
      const updatedUser = await updateUser(formData);
      setUser(updatedUser); // Update the context
      setShowModal(false);
      // Maybe show a success message
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      // Show error
    } finally {
      setUpdating(false);
    }
  };

  const rolarEsquerda = () => {
    if (carrosselRef.current) {
      carrosselRef.current.scrollBy({ left: -300, behavior: "smooth" }); 
    }
  };

  const rolarDireita = () => {
    if (carrosselRef.current) {
      carrosselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    // Corrigido para min-h-screen e w-full
    <div className="h-screen w-screen overflow-x-hidden bg-purple-50">
      <Header />
      <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center sticky top-6">
            
          <div className="relative group mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-purple-100 overflow-hidden relative">
              <img 
                src={fotoPerfil} 
                alt="Foto de perfil" 
                className={`w-full h-full object-cover transition ${fazendoUpload ? 'opacity-50' : 'opacity-100'}`}
              />
              {fazendoUpload && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-purple-800 font-bold text-sm">Enviando...</span>
                </div>
              )}
            </div>
            
            {/* Input invisível que faz a ponte com o sistema de arquivos */}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleUploadImagem} 
            />

            {/* Botão "Bola" para editar foto */}
            <button 
              onClick={dispararEscolhaDeArquivo}
              disabled={fazendoUpload}
              className="absolute bottom-0 right-0 bg-purple-800 text-white p-2 rounded-xl hover:bg-purple-700 transition shadow-lg border-2 border-white disabled:bg-gray-400" 
              title="Alterar foto"
            >
              <FontAwesomeIcon icon={faCamera} />
            </button>
          </div>

            <h2 className="text-xl font-bold text-gray-800 p-4">{ user.nome }</h2>

            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-purple-700 transition flex items-center justify-center gap-2" onClick={() => setShowModal(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar Dados Pessoais
            </button>
          </div>
        </div>

        <main className="flex-1 min-w-0 w-full md:pl-6">
          
          <section className="mb-10 w-full max-w-full min-w-0">
            <h2 className="text-xl font-semibold text-purple-700 mb-4 px-2">Minhas Receitas</h2>
            
            {/* Feedbacks de estado da API */}
            {carregando && <p className="px-2 text-gray-500">Carregando receitas...</p>}
            {erro && <p className="px-2 text-red-500">{erro}</p>}
            {!carregando && !erro && minhasReceitas.length === 0 && (
              <p className="px-2 text-gray-500">Você ainda não criou nenhuma receita.</p>
            )}

            {/* Só exibe o carrossel se houver receitas */}
            {!carregando && !erro && minhasReceitas.length > 0 && (
              <div className="relative w-full group">
                <button 
                  onClick={rolarEsquerda}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-md text-purple-700 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
                  aria-label="Rolar para a esquerda"
                >
                  ◀ 
                </button>

                <div 
                  ref={carrosselRef}
                  className="flex overflow-x-auto gap-6 pb-4 px-2 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {/* Corrigido aqui: de receitas.map para minhasReceitas.map */}
                  {minhasReceitas.map((r) => (
                    <Link key={r.id} to={`/receita/${r.id}`} className="bg-white rounded-2xl shadow p-4 flex-none w-64 sm:w-72 snap-start">
                      <img
                          src={`http://localhost:8000/${r.imagem_path}`}
                          alt={r.titulo}
                          className="rounded-xl mb-2 w-full h-40 object-cover"
                      />
                      <h3 className="font-bold text-purple-700 truncate">{r.titulo}</h3>
                      <p className="text-sm text-gray-600">Tempo: {r.tempo_minutos} min</p>
                    </Link>
                  ))}
                </div>

                <button 
                  onClick={rolarDireita}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-md text-purple-700 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
                  aria-label="Rolar para a direita"
                >
                  ▶
                </button>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-purple-700 mb-4 px-2">Receitas Salvas</h2>
            
            {/* Feedbacks de estado da API */}
            {carregando && <p className="px-2 text-gray-500">Carregando receitas favoritas...</p>}
            {erro && <p className="px-2 text-red-500">{erro}</p>}
            {!carregando && !erro && receitasFavoritas.length === 0 && (
              <p className="px-2 text-gray-500">Você ainda não salvou nenhuma receita.</p>
            )}

            {!carregando && !erro && receitasFavoritas.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
                {receitasFavoritas.map((r) => (
                  <Link key={r.id} to={`/receita/${r.id}`} className="bg-white rounded-2xl shadow p-4 border border-purple-100">
                    <img
                      src={r.imagem_path ? `http://localhost:8000/${r.imagem_path}` : "https://via.placeholder.com/300x200"}
                      alt={r.titulo}
                      className="rounded-xl mb-2 w-full h-40 object-cover"
                    />
                    <h3 className="font-bold text-purple-700 truncate">{r.titulo}</h3>
                    <p className="text-sm text-gray-600">Tempo: {r.tempo_minutos} min</p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-purple-700 mb-4">Editar Dados Pessoais</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateUser}
                disabled={updating}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-400"
              >
                {updating ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}