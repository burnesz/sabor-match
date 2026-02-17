import { listaCategorias, novaReceita } from "../../api/receitas";
import { uploadImagemReceita } from "../../api/uploads";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { notify } from "../../utils/notification";

export function useNovaReceita() {
    const navigate = useNavigate();
    const [imagemPreview, setImagemPreview] = useState(null);
    const [imagem, setImagem] = useState(null);
    const [inputIngredienteAtual, setInputIngredienteAtual] = useState({
        nome: "", quantidade: "", unidade: "un"
    });
    const [categorias, setCategorias] = useState([]);

    const [form, setForm] = useState({
        titulo: "",
        descricao: "",
        tempo_minutos: "",
        porcoes: "",
        ingredientes: [],
        categoria: [], // AGORA É UM ARRAY DE IDs
        imagem_path: ""
    });

    useEffect(() => {
        listaCategorias().then((categorias) => {
            setCategorias(categorias);
        }).catch((err) => {
            navigate('/', { state: { tipo: "error", mensagem: err.message } });
        });
    }, []);

    const handleIngredienteChange = (e) => {
        const { name, value } = e.target;
        setInputIngredienteAtual((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagemPreview(URL.createObjectURL(file));
            setImagem(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const toggleCategoria = (idCategoria) => {
        setForm((prev) => {
            const jaSelecionado = prev.categoria.includes(idCategoria);
            let novasCategorias;

            if (jaSelecionado) {
                // Se já tem, remove
                novasCategorias = prev.categoria.filter(id => id !== idCategoria);
            } else {
                // Se não tem, adiciona
                novasCategorias = [...prev.categoria, idCategoria];
            }

            return { ...prev, categoria: novasCategorias };
        });
    };

    const adicionarIngrediente = (novoIngrediente) => {
        setForm((prev) => ({
            ...prev,
            ingredientes: [...prev.ingredientes, novoIngrediente]
        }));
    };

    const removerIngrediente = (indexParaRemover) => {
        setForm((prev) => ({
            ...prev,
            ingredientes: prev.ingredientes.filter((_, index) => index !== indexParaRemover)
        }));
    };

    const handleAddClick = () => {
        if (!inputIngredienteAtual.nome || !inputIngredienteAtual.quantidade) return;
        adicionarIngrediente({
            nome: inputIngredienteAtual.nome,
            quantidade: parseFloat(inputIngredienteAtual.quantidade),
            unidade: inputIngredienteAtual.unidade
        });
        setInputIngredienteAtual({ nome: "", quantidade: "", unidade: "un" });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!imagem) throw new Error("Selecione uma imagem.");

            const dataUpload = await uploadImagemReceita(imagem);
            const pathDaImagem = dataUpload.imagem_path;

            const dadosFinais = { ...form, imagem_path: pathDaImagem };

            console.log("Enviando:", dadosFinais);

            const dataReceita = await novaReceita(dadosFinais);
            if (!dataReceita) throw new Error("Erro ao criar receita.");

            navigate('/', { state: { tipo: "success", mensagem: "Receita criada!" } });
        } catch (err) {
            notify.error(err.message);
        }
    };

    const isFormValid =
        form.titulo &&
        form.descricao &&
        form.tempo_minutos &&
        form.porcoes &&
        form.ingredientes.length > 0 &&
        form.categoria.length > 0;
        
    return {
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
    };
}