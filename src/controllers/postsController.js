import fs from "fs";
import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModel.js";
import gerarDescricaoComGemini from "../services/geminiService.js";

export const listarPosts = async (req, res) => {
    const posts = await getTodosPosts();
    // Tratando as respostas do servidor como estruturas JSON
    res.status(200).json(posts);
}

export const postarNovoPost = async (req, res) => {
    // Guardando o conteúdo do post
    const novoPost = req.body;

    try {
        const postCriado = await criarPost(novoPost);
        res.status(200).json(postCriado);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}

export const uploadImagem = async (req, res) => {
    // Guardando o conteúdo do post
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };

    try {
        const postCriado = await criarPost(novoPost);

        // Passando o caminho da imagem para o banco de dados, e não a imagem em si, pois ela ficará salva localmente
        // Lembrando que por enquanto só funcionam imagens no formato png
        // Também estamos definindo o caminho delas de acordo com o id que foi gerado automaticamente
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        // Renomeando a imagem para que fique com o mesmo nome do id que foi gerado
        fs.renameSync(req.file.path, imagemAtualizada);
        res.status(200).json(postCriado);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}

export const atualizarNovoPost = async (req, res) => {
    // Pegando o id que foi passado na rota (requisição)
    const id = req.params.id;
    // Pegando a url da imagem de acordo com o id capturado
    const urlImagem = `http://localhost:3000/${id}.png`;

    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);

        const descricao = await gerarDescricaoComGemini(imgBuffer);

        // Montando o objeto que representa o post com os dados da requisição
        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }

        // Atualizando o post de acordo com o id passado
        const postCriado = await atualizarPost(id, post);

        res.status(200).json(postCriado);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}