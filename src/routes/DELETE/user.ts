import { Router, Request, Response } from "express";
import { Usuario } from "../../db/models";
import { AuthenticatedRequest } from "../../../interfaces/authenticated";

export const userRouterDelete = Router().delete('/user/:userName', async (req: AuthenticatedRequest, res: Response) => {
    const id = req.user.id;

    try {
        const userDelete = await Usuario.findByIdAndDelete(id)

        if(userDelete)
            res.status(201).json(userDelete)
        else
        res.status(404).json({
            mensage: 'Usuário não encontrado'
        })

    } catch (error: any) {

        res.status(500).json({
            mensage: error
        })
    }
})