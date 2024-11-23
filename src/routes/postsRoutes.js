import express from "express";
import multer from "multer";
import cors from "cors";
import { atualizarNovoPost, listarPosts, postarNovoPost, uploadImagem } from "../controllers/postsController.js";

const corsOptions = {
    // Endereço do front, que vai poder fazer as requisições para o servidor
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200
};

// Deixando o Multer preparado para lidar com a configuração de pastas do windows
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

// Criando a instrução para que o multer crie a pasta uploads, a qual ele irá manipular
const upload = multer({ dest: "./uploads", storage });

const routes = (app) => {
    // Definindo que o servidor vai devolver JSON para as requisições ao invés de Strings normais
    app.use(express.json());
    // Avisando que vai poder fazer requisições de acordo com o cors options declarado lá em cima
    app.use(cors(corsOptions));

    // Parâmetro 1: Rota do servidor (endpoint) - Podemos definir
    // Parâmetro 2: Requisição e Resposta do servidor
    // Rota para buscar todos os posts
    app.get("/posts", listarPosts);

    // Rota para criar um novo post
    app.post("/posts", postarNovoPost);

    app.post("/upload", upload.single("imagem"), uploadImagem);

    // Configurando a rota de put (atualizar)
    app.put("/upload/:id", atualizarNovoPost);
}

export default routes;