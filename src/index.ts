import express, { Application } from "express";
import config from "../config"
import dotenv from 'dotenv';
import { usuarioPostRouter } from "./routes/POST/users";


const { porta } = config 

const app: Application = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).send('Hello World')
})

app.use('/api/register', usuarioPostRouter)

app.listen(porta, () => {
    console.log('Servidor rodando na porta', porta)
})