import 'dotenv/config';
// Importando a função que irá conectar ao banco de dados, para importar pelo node é necessário colocar .js no final
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";

// Chamando a função de conectar ao banco e passando a STRING_CONEXAO como parâmetro
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

export const getTodosPosts = async () => {
    // Guardando o banco de dados do Mongo
    const db = conexao.db("instabytes-imersion");

    // Guardando a coleção (tabela) do banco de dados
    const colecao = db.collection("posts");

    // Retornando a coleção em formato de array
    return colecao.find().toArray();
}

export const criarPost = async (novoPost) => {
    const db = conexao.db("instabytes-imersion");
    const colecao = db.collection("posts");

    //  Inserindo um novo post
    return colecao.insertOne(novoPost);
}

export const atualizarPost = async (id, novoPost) => {
    const db = conexao.db("instabytes-imersion");
    const colecao = db.collection("posts");

    // Guardando o id do post que queremos atualizar para o Mongo entender (Obrigatório do Mongo)
    const objectId = ObjectId.createFromHexString(id);

    // Atualizando o post
    return colecao.updateOne({ _id: new ObjectId(objectId) }, { $set: novoPost });
}