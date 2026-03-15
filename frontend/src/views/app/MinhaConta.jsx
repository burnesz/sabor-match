import { useEffect, useRef, useState } from 'react';
import Header from "../../components/Header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { listaReceitasCarrossel, listarReceitasFavoritas } from "../../api/receitas.js";
import { useAuth } from "../../context/AuthContext";
import { uploadImagemPerfil } from "../../api/uploads.js";
import { updateUser } from "../../api/auth.js";
import ReceitaCard from "../../components/ReceitaCard.jsx";
import { Avatar } from "../../components/Avatar.jsx";

export default function MinhaConta() {
  const carrosselMinhasReceitasRef = useRef(null);
  const carrosselReceitasSalvasRef = useRef(null);
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

  // 1º Hook: Atualiza a foto de perfil e os dados do form quando o user carregar
  useEffect(() => {
    if (user) {
      setFotoPerfil(`${import.meta.env.VITE_SABOR_MATCH_BACKEND}/uploads/perfil/perfil_${user.id}.png`);
      setFormData({ nome: user.nome, email: user.email });
    }
  }, [user]);

  useEffect(() => {
    const buscarReceitas = async () => {
      try {
        setCarregando(true); // Garante o status de carregamento
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

    // Só dispara a API se o usuário já estiver disponível no contexto
    if (user) {
      buscarReceitas();
    }
  }, [user]); // Agora ele depende de 'user' para rodar no momento certo

  // REGRA DE OURO: Retornos antecipados (early returns) SEMPRE vêm DEPOIS de todos os Hooks
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

  const dispararEscolhaDeArquivo = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadImagem = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

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
      setUser(updatedUser); 
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    } finally {
      setUpdating(false);
    }
  };

  const rolarEsquerda = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: "smooth" }); 
    }
  };

  const rolarDireita = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="h-screen w-screen overflow-x-hidden bg-purple-50">
      <Header />
      
      <main className="pt-24 pb-8 px-2 md:px-4 max-w-7xl mx-auto">
        {/* Container Principal: Cartão Branco */}
        <div className="sm:bg-white sm:rounded-2xl shadow-sm sm:shadow-lg overflow-hidden flex flex-col md:flex-row">
          
          {/* --- COLUNA DA ESQUERDA: PERFIL --- */}
          <aside className="w-full md:w-80 flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/30 md:bg-transparent">
            <div className="p-2 md:p-8 flex flex-col items-center md:sticky md:top-24">
              
              <div className="relative group mb-4">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-purple-100 overflow-hidden relative shadow-inner">
                  {fotoPerfil && (
                  <Avatar 
                    src={fotoPerfil} 
                    alt={user.nome} 
                    className={`w-full h-full object-cover transition ${fazendoUpload ? 'opacity-50' : 'opacity-100'}`}
                  />
                  )}
                  {fazendoUpload && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                      <span className="text-purple-800 font-bold text-xs md:text-sm">Enviando...</span>
                    </div>
                  )}
                </div>
                
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleUploadImagem} 
                />

                <button 
                  onClick={dispararEscolhaDeArquivo}
                  disabled={fazendoUpload}
                  className="absolute bottom-0 right-0 bg-purple-800 text-white p-2 rounded-full hover:bg-purple-700 transition shadow-md border-2 border-white disabled:bg-gray-400" 
                  title="Alterar foto"
                >
                  <FontAwesomeIcon icon={faCamera} className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 text-center">{ user.nome }</h2>

              <button 
                className="w-full max-w-[250px] bg-purple-100 text-purple-700 hover:bg-purple-200 py-2 px-4 rounded-xl font-medium transition flex items-center justify-center gap-2" 
                onClick={() => setShowModal(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Dados
              </button>
            </div>
          </aside>

          {/* --- COLUNA DA DIREITA: RECEITAS --- */}
          <div className="flex-1 min-w-0 w-full p-4 md:p-4 flex flex-col gap-10">
            
            {/* SEÇÃO: MINHAS RECEITAS */}
            <section className="w-full max-w-full min-w-0">
              <h2 className="text-xl font-semibold text-purple-700 mb-4 px-2 md:px-0">Minhas Receitas</h2>
              
              {carregando && <p className="px-2 md:px-0 text-gray-500 animate-pulse">Carregando receitas...</p>}
              {erro && <p className="px-2 md:px-0 text-red-500 bg-red-50 p-3 rounded-lg">{erro}</p>}
              {!carregando && !erro && minhasReceitas.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-500">Você ainda não criou nenhuma receita.</p>
                </div>
              )}

              {!carregando && !erro && minhasReceitas.length > 0 && (
                <div className="relative w-full group">
                  <button 
                    onClick={() => rolarEsquerda(carrosselMinhasReceitasRef)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-md text-purple-700 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
                    aria-label="Rolar para a esquerda"
                  >
                    ◀ 
                  </button>

                  <div 
                    ref={carrosselMinhasReceitasRef}
                    className="flex overflow-x-auto gap-6 pb-4 px-2 md:px-0 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-proximity"
                  >
                  {minhasReceitas.map((r) => (
                    <ReceitaCard key={r.id} receita={r} />
                  ))}
                  </div>

                  <button 
                    onClick={() => rolarDireita(carrosselMinhasReceitasRef)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-md text-purple-700 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
                    aria-label="Rolar para a direita"
                  >
                    ▶
                  </button>
                </div>
              )}
            </section>

            {/* SEÇÃO: RECEITAS SALVAS */}
            <section className="w-full max-w-full min-w-0">
              <h2 className="text-xl font-semibold text-purple-700 mb-4 px-2 md:px-0">Receitas Salvas</h2>
              
              {carregando && <p className="px-2 md:px-0 text-gray-500 animate-pulse">Carregando receitas favoritas...</p>}
              {erro && <p className="px-2 md:px-0 text-red-500 bg-red-50 p-3 rounded-lg">{erro}</p>}
              {!carregando && !erro && receitasFavoritas.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-500">Você ainda não salvou nenhuma receita.</p>
                </div>
              )}

              {!carregando && !erro && receitasFavoritas.length > 0 && (
                <div className="relative w-full group">
                  <button 
                    onClick={() => rolarEsquerda(carrosselReceitasSalvasRef)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-md text-purple-700 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
                    aria-label="Rolar para a esquerda"
                  >
                    ◀ 
                  </button>

                  <div 
                    ref={carrosselReceitasSalvasRef}
                    className="flex overflow-x-auto gap-6 pb-4 px-2 md:px-0 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-proximity"
                  >
                  {receitasFavoritas.map((r) => (
                    <ReceitaCard key={r.id} receita={r} />
                  ))}
                  </div>

                  <button 
                    onClick={() => rolarDireita(carrosselReceitasSalvasRef)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-md text-purple-700 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
                    aria-label="Rolar para a direita"
                  >
                    ▶
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* --- MODAL --- */}
      {/* Movido para a raiz do componente para evitar bugs de z-index com o overflow dos carrosséis */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
            <h2 className="text-xl font-bold text-purple-700 mb-4">Editar Dados Pessoais</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="text-black w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="text-black w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateUser}
                disabled={updating}
                className="px-5 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-medium disabled:bg-purple-400 transition"
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