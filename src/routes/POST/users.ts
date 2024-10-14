import { Router, Request, Response } from "express";
import { Usuario } from "../../db/models";

export const usuarioPostRouter = Router().post('/users', async (req: Request, res: Response) => {
    const { user, name } = req.body;

    try {
        const userLow = user.trimStart().toLowerCase()
        if (/.+/.test(userLow)) {
            const date = new Date();
            const followers: Array<string> = [];
            const following: Array<string> = [];
            const numberFollowers = 0
            const numberFollowing = 0
            const posts: Array<string> = [];

            const registerUser = new Usuario({
                user: userLow,
                name,
                date,
                followers,
                following,
                numberFollowers,
                numberFollowing,
                posts
            })

            const saveUser = await registerUser.save()

            res.status(201).json(saveUser)
        } else {
            res.status(400).json({
                mensage: 'Nome de usuário incompatível'
            })
        }
    } catch (error: any) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.user) {
            res.status(400).json({
                message: `O nome de usuário '${error.keyValue.user}' já está em uso. Por favor, escolha outro.`
            });
        } else {
            res.status(500).json({
                message: 'Erro ao tentar criar usuário'
            })
        }
    }
})