import express, { Application } from "express";
import config from "../config"
import { usuarioPostRouter } from "./routes/POST/users";
import { postsRouterPost } from "./routes/POST/post";
import { postsRouterPatch } from "./routes/PATCH/post";
import { userRouterPatch } from "./routes/PATCH/users";
import { postsRouterDelete } from "./routes/DELETE/post";
import { userRouterDelete } from "./routes/DELETE/user";
import { loginRouterPost } from "./routes/POST/login";
import { isLogin } from "./middlewares/isLogin";
import { AuthenticatedRequest } from "../interfaces/authenticated";
import { userGetRouter } from "./routes/GET/users/searchUsers";
import { searchPostsRouterGet } from "./routes/GET/posts/searchPosts";
import { refreshTokenRouterPost } from "./routes/POST/refreshToken";
import { verifyRouterGet } from "./routes/GET/account/verifyAccount";
import { postsRouterGet } from "./routes/GET/posts/posts";
import { followRouterPost } from "./routes/POST/follow";


const { porta } = config

const app: Application = express()

app.use(express.json())
// app.use(authenticateToken)

app.get('/', isLogin, (req: AuthenticatedRequest, res) => {
    res.status(200).send(`Hello ${req.user?.user}`)
})

app.use('/api', loginRouterPost, refreshTokenRouterPost, verifyRouterGet)
app.use('/api/register', usuarioPostRouter, postsRouterPost)
app.use('/api/edit', postsRouterPatch, userRouterPatch)
app.use('/api/delete', postsRouterDelete, userRouterDelete)
app.use('/api', userGetRouter, searchPostsRouterGet, postsRouterGet, followRouterPost)

app.listen(porta, () => {
    console.log('Servidor rodando na porta', porta)
})