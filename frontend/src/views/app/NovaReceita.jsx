import React, { useState } from "react";
import Header from "../../components/Header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp, faUtensils, faClock, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { novaReceita } from "../../api/receitas";

export default function NewRecipe() {
  const [imagemPreview, setImagemPreview] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    tempo: "",
    porcoes: "",
    ingredientes: "",
    categoria: "",
    imagem_arquivo: null // Para guardar o arquivo real
  });

  // 2. Função genérica para atualizar os campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Função específica para a imagem
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagemPreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, imagem_arquivo: file }));
    }
  };

  // 3. Função de Envio (Submit)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita o recarregamento da página
    
    // Aqui você enviaria para o seu backend (API)
    console.log("Dados prontos para envio:", formData);

    try {
      const data = await novaReceita(formData);
      if (data) alert("Receita criada com sucesso!");
      console.log("Resposta do servidor:", data);
    } catch (err) {
    console.error("Erro ao criar nova receita:", err);
  }
};

  const isFormValid = 
    formData.titulo && 
    formData.descricao && 
    formData.tempo && 
    formData.porcoes && 
    formData.ingredientes && 
    formData.categoria;

  return (
    <div className="min-h-screen w-screen bg-purple-50">
      <Header />

      <main className="p-4 md:p-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-[32px] shadow-xl overflow-hidden p-6 md:p-10">
          
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-10">
            
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              <label 
                className={`
                  flex flex-col items-center justify-center w-full h-96 
                  bg-gray-100 rounded-[32px] cursor-pointer 
                  hover:bg-gray-200 transition-colors border-2 border-dashed border-gray-300
                  ${imagemPreview ? 'p-0 overflow-hidden border-none' : 'p-4'}
                `}
              >
                {imagemPreview ? (
                  <img src={imagemPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-500 px-4">
                    <FontAwesomeIcon icon={faCloudArrowUp} className="text-3xl mb-4 text-gray-400" />
                    <p className="font-semibold text-sm">Escolha uma foto</p>
                  </div>
                )}
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleImageChange} 
                  accept="image/*" 
                />
              </label>
            </div>

            <div className="w-full md:w-2/3 flex flex-col gap-6">
              
              {/* Título */}
              <div className="flex flex-col gap-2">
                <label htmlFor="titulo" className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-2">Título da Receita</label>
                <input 
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  type="text" 
                  placeholder="Ex: Bolo de Cenoura da Vovó" 
                  className="w-full p-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition placeholder-gray-400 text-lg font-medium text-gray-700"
                />
              </div>

              {/* Descrição */}
              <div className="flex flex-col gap-2">
                <label htmlFor="descricao" className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-2">Descrição</label>
                <textarea 
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Conte um pouco sobre essa receita..." 
                  className="w-full p-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition placeholder-gray-400 text-gray-700 resize-none"
                ></textarea>
              </div>

              {/* Grid Tempo e Porções */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 rounded-2xl p-4 flex items-center gap-3 focus-within:ring-2 focus-within:ring-purple-400 transition">
                    <FontAwesomeIcon icon={faClock} className="text-gray-400" />
                    <input 
                      name="tempo"
                      value={formData.tempo}
                      onChange={handleChange}
                      type="number"
                      min="1"
                      placeholder="Minutos" 
                      className="bg-transparent w-full focus:outline-none text-gray-700 font-medium"
                    />
                </div>
                <div className="bg-gray-100 rounded-2xl p-4 flex items-center gap-3 focus-within:ring-2 focus-within:ring-purple-400 transition">
                    <FontAwesomeIcon icon={faUserGroup} className="text-gray-400" />
                    <input 
                      name="porcoes"
                      value={formData.porcoes}
                      onChange={handleChange}
                      type="number"
                      min="1"
                      placeholder="Porções" 
                      className="bg-transparent w-full focus:outline-none text-gray-700 font-medium" 
                    />
                </div>
              </div>

              {/* Ingredientes */}
              <div className="flex flex-col gap-2">
                <label htmlFor="ingredientes" className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-2">Ingredientes</label>
                <textarea 
                  id="ingredientes"
                  name="ingredientes"
                  value={formData.ingredientes}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Liste os ingredientes (um por linha)" 
                  className="w-full p-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition placeholder-gray-400 text-gray-700"
                ></textarea>
              </div>

               {/* Categoria */}
               <div className="flex flex-col gap-2">
                <label htmlFor="categoria" className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-2">Categoria</label>
                <div className="relative">
                  <select 
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-700 appearance-none cursor-pointer"
                  >
                    <option value="">Escolha uma categoria</option>
                    <option value="massas">Massas</option>
                    <option value="doces">Doces & Sobremesas</option>
                    <option value="fit">Saudável / Fit</option>
                    <option value="lanches">Lanches Rápidos</option>
                  </select>
                  <FontAwesomeIcon icon={faUtensils} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Botão Submit */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition shadow-lg hover:shadow-purple-200 transform hover:-translate-y-1 disabled:opacity-50"
                  disabled={!isFormValid}
                >
                  {!isFormValid ? 'Preencha todos campos' : 'Publicar Receita'}
                </button>
              </div>

            </div>
          </form>
        </div>
      </main>
    </div>
  );
}