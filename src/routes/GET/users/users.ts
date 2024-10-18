import { Router, Response } from "express";
import { Usuario } from "../../../db/models";
import { AuthenticatedRequest } from "../../../../interfaces/authenticated";
import { authenticateToken } from "../../../middlewares/authenticateToken";
import { isVerify } from "../../../middlewares/isVerify";

export const userGetRouter = Router().get('/users/:name', authenticateToken, isVerify, async (req: AuthenticatedRequest, res: Response) => {
    const { name } = req.params;

    try {

        const users = await Usuario.find({
            $or: [
                { name: { $regex: name, $options: 'i' } },
                { user: { $regex: name, $options: 'i' } }
            ]
        }).select('user name');

        if (users.length === 0) {
            res.status(404).json({
                mensage: 'Nenhum usuário encontrado'
            })
        } else {
            res.status(201).json(users)
        }

    } catch (error) {
        res.status(500).json({
            mensage: 'Erro ao processar solicitação', error
        })
    }


})