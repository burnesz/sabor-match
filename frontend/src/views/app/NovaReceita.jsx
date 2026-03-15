import React, { useState } from "react";
import Header from "../../components/Header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloudArrowUp, faClock, faUserGroup, faPlus, faTrash, faTags
} from '@fortawesome/free-solid-svg-icons';
import { useNovaReceita } from "../../hooks/app/useNovaReceita";

const UNIDADES = ["un", "g", "kg", "ml", "l", "xic", "colher (sopa)", "colher (chá)"];

export default function NovaReceita() {
  const {
    form,
    categorias,
    imagemPreview,
    inputIngredienteAtual,
    handleIngredienteChange,
    handleAddClick,
    handleChange,
    handleImageChange,
    removerIngrediente,
    toggleCategoria,
    handleSubmit,
    isFormValid
  } = useNovaReceita();

  return (
    <div className="min-h-screen w-screen bg-purple-50">
      <Header />

      <main className="p-4 md:p-8 max-w-5xl mx-auto">
        <div className="p-4 sm:p-8 sm:bg-white sm:rounded-2xl sm:shadow-lg mb-8">

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-10">

            {/* Esquerda: Imagem (sem alterações) */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              <label className={`
                  flex flex-col items-center justify-center w-full h-96 
                  bg-gray-100 rounded-[32px] cursor-pointer 
                  hover:bg-gray-200 transition-colors border-2 border-dashed border-gray-300
                  ${imagemPreview ? 'p-0 overflow-hidden border-none' : 'p-4'}
                `}>
                {imagemPreview ? (
                  <img src={imagemPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-500 px-4">
                    <FontAwesomeIcon icon={faCloudArrowUp} className="text-3xl mb-4 text-gray-400" />
                    <p className="font-semibold text-sm">Escolha uma foto</p>
                  </div>
                )}
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>

            {/* Direita: Campos */}
            <div className="w-full md:w-2/3 flex flex-col gap-6">

              {/* Título e Descrição (Omitidos para brevidade, iguais ao anterior) */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-2">Título</label>
                <input name="titulo" value={form.titulo} onChange={handleChange} required type="text" placeholder="Ex: Bolo de Cenoura" className="w-full p-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition placeholder-gray-400 text-lg font-medium text-gray-700" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-2">Descrição</label>
                <textarea name="descricao" value={form.descricao} onChange={handleChange} rows="3" placeholder="Sobre a receita..." className="w-full p-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition placeholder-gray-400 text-gray-700 resize-none"></textarea>
              </div>

              {/* Tempo e Porções (Omitidos para brevidade) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 rounded-2xl p-4 flex items-center gap-3 focus-within:ring-2 focus-within:ring-purple-400 transition">
                  <FontAwesomeIcon icon={faClock} className="text-gray-400" />
                  <input name="tempo_minutos" value={form.tempo_minutos} onChange={handleChange} type="number" min="1" placeholder="Minutos" className="bg-transparent w-full focus:outline-none text-gray-700 font-medium" />
                </div>
                <div className="bg-gray-100 rounded-2xl p-4 flex items-center gap-3 focus-within:ring-2 focus-within:ring-purple-400 transition">
                  <FontAwesomeIcon icon={faUserGroup} className="text-gray-400" />
                  <input name="porcoes" value={form.porcoes} onChange={handleChange} type="number" min="1" placeholder="Porções" className="bg-transparent w-full focus:outline-none text-gray-700 font-medium" />
                </div>
              </div>

              {/* Ingredientes */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-2">Ingredientes</label>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      name="quantidade" // Importante: o nome tem que bater com o estado
                      value={inputIngredienteAtual.quantidade}
                      onChange={handleIngredienteChange} // Usa a função específica
                      type="number"
                      placeholder="Qtd"
                      className="text-black w-full sm:w-20 p-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <select
                      name="unidade" // Importante
                      value={inputIngredienteAtual.unidade}
                      onChange={handleIngredienteChange} // Usa a função específica
                      className="w-full sm:w-28 p-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700 cursor-pointer"
                    >
                      {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                    <input
                      name="nome" // Importante
                      value={inputIngredienteAtual.nome}
                      onChange={handleIngredienteChange} // Usa a função específica
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddClick())}
                      type="text"
                      placeholder="Nome do ingrediente"
                      className="text-black flex-1 p-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <button type="button" onClick={handleAddClick} className="cursor-pointer bg-purple-100 text-purple-600 p-3 rounded-xl hover:bg-purple-200 transition flex items-center justify-center min-w-[50px]"><FontAwesomeIcon icon={faPlus} /></button>
                  </div>
                  {form.ingredientes.length > 0 ? (
                    <div className="flex flex-col gap-2 mt-2">
                      {form.ingredientes.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                          <div className="flex items-center gap-2 text-gray-700">
                            <span className="font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md text-sm">{item.quantidade} {item.unidade}</span>
                            <span>{item.nome}</span>
                          </div>
                          <button type="button" onClick={() => removerIngrediente(index)} className="cursor-pointer text-gray-400 hover:text-red-500 transition px-2"><FontAwesomeIcon icon={faTrash} size="sm" /></button>
                        </div>
                      ))}
                    </div>
                  ) : (<p className="text-center text-red-400 text-sm py-2 italic">Adicione pelo menos um ingrediente</p>)}
                </div>
              </div>

              {/* --- CATEGORIAS (MÚLTIPLA SELEÇÃO) --- */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 ml-2">
                  <FontAwesomeIcon icon={faTags} className="text-gray-400 text-xs" />
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Categorias</label>
                </div>

                <div className="flex flex-wrap gap-2 p-2">
                  {categorias.map((cat) => {
                    // Verifica se esta categoria está selecionada
                    const isSelected = form.categoria.includes(cat.id);

                    return (
                      <button
                        key={cat.id}
                        type="button" // Importante para não dar submit no form
                        onClick={() => toggleCategoria(cat.id)}
                        className={`
                          px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border
                          ${isSelected
                            ? "bg-purple-600 text-white border-purple-600 shadow-md transform scale-105"
                            : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-purple-100 hover:text-purple-600 hover:border-purple-200"
                          }
                        `}
                      >
                        {cat.nome}
                      </button>
                    );
                  })}
                </div>
                {form.categoria.length === 0 && (
                  <p className="text-xs text-red-400 italic ml-2 mt-1">* Selecione pelo menos uma categoria</p>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition shadow-lg hover:shadow-purple-200 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isFormValid}
                >
                  Publicar Receita
                </button>
              </div>

            </div>
          </form>
        </div>
      </main >
    </div >
  );
}