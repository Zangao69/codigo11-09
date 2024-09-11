/**
 * MODEL -> DB BD -> Regras de negocio
 * CONTROLLER -> controla o que vem do view e devolve o que vem do model
 * VIEW -> Páginas
 */

import "dotenv/config"
import express from "express"
import cors from "cors"
import path from "node:path"
import { fileURLToPath } from "node:url"

//importar a conexão com o banco
import conn from "./config/conn.js"

//importar modulos
import "./models/usuariosModels.js";
import ".models/ObjetoModel.js";
import ".models/ObjetosImagesModel.js"

//importar as rotas
import usuarioRouter from "./routes/usuarioRouter.js";
import ObjetosRouter from "./routers/ObjetoRouter.js";

const PORT = process.env.PORT || 3333
const app = express()

//Apontar para pasta public
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//3 middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// console.log("filename: ", __filename)
// console.log("dirname: ", __dirname)

//Pasta para os arquivos estaticos
app.use("public", express.static(path.join(__dirname, "public")));

//Utilizar as rotas
app.use("/usuarios", usuarioRouter);
app.use("/objtos", ObjetosRouter);

app.get((request, response) => {
    response.status(404).json({ message: "Rota não encontrada" })
})

app.listen(PORT, () => {
    console.log(`Servidor on port ${PORT}`)
})