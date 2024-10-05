import { Router, Request, Response } from "express";
import { Usuario } from "../../db/models";

export const usuarioPostRouter = Router().post('/users', async (req: Request, res: Response) => {
    const { user, name } = req.body;

    try {

        const date = new Date();
        const followers = 0
        const following = 0

        const registerUser = new Usuario({
            user,
            name,
            date,
            followers,
            following
        })

        const saveUser = await registerUser.save()

        res.status(201).json(saveUser)
    } catch (error: any) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.user) {
            res.status(400).json({
                message: `O nome de usuário '${error.keyValue.user}' já está em uso. Por favor, escolha outro.`
            });
        } else{
            res.status(404).json({
                message: 'Rota não encontrada'
            })
        }
    }
})