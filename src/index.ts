import express, { Application } from "express";
import config from "../config"
import { usuarioPostRouter } from "./routes/POST/users";
import { postsRouterPost } from "./routes/POST/post";


const { porta } = config 

const app: Application = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).send('Hello World')
})

app.use('/api/register', usuarioPostRouter, postsRouterPost)

app.listen(porta, () => {
    console.log('Servidor rodando na porta', porta)
})