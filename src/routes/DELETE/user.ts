import { Router, Request, Response } from "express";
import { Usuario } from "../../db/models";

export const userRouterDelete = Router().delete('/user/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

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