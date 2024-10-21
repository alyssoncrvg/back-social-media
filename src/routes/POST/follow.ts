import { Router, Response } from "express";
import { AuthenticatedRequest } from "../../../interfaces/authenticated";
import { Usuario } from "../../db/models";
import { authenticateToken } from "../../middlewares/authenticateToken";
import { isVerify } from "../../middlewares/isVerify";

export const followRouterPost = Router().post("/follow/:id", authenticateToken, isVerify, async (req: AuthenticatedRequest, res: Response) => {

    const { id } = req.params;
    const idUser = req.user.id;

    try {

        const user = await Usuario.findById(idUser)

        if (user) {
            const userFollowing = await Usuario.findById(id)
            if (userFollowing) {
                // Atualizar o usuário que está seguindo (user)
                await Usuario.updateOne(
                    { _id: idUser },
                    {
                        $push: { following: id },
                        $inc: { numberFollowing: 1 }
                    }
                );

                // Atualizar o usuário que está sendo seguido (userFollowing)
                await Usuario.updateOne(
                    { _id: id },
                    {
                        $push: { followers: idUser },
                        $inc: { numberFollowers: 1 }
                    }
                );

                res.status(201).json({
                    mensage: 'Seguidor adicionar com sucesso'
                })
            } else {
                res.status(404).json({
                    mensage: `Usuário ${id} não encontrado`
                })
            }
        } else {
            res.status(404).json({
                mensage: `Usuário ${idUser} não encontrado`
            })
        }

    } catch (error) {
        res.status(500).json({
            mensage: 'Erro ao processar follow', error
        })
    }

})