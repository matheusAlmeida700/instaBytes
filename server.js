// Criando um servidor simples com o Express
import express from "express";
import routes from "./src/routes/postsRoutes.js";

// app é o próprio servidor, no caso, criado utilizando o express
const app = express();
// Determinando que a pasta uploads será pública (aberta)
app.use(express.static("uploads"));
routes(app);

// 3000 é a porta do servidor, nesse caso, específico para um servidor local
app.listen(3000, () => {
    console.log("Servidor escutando...");
});
// Servidor, fique escutando nessa porta (3000) e printe esse texto no console

