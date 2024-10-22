import { Router, Response } from "express";
import { Posts, Usuario } from "../../db/models";
import { authenticateToken } from "../../middlewares/authenticateToken";
import { AuthenticatedRequest } from "../../../interfaces/authenticated";
import { isVerify } from "../../middlewares/isVerify";

export const postsRouterDelete = Router().delete('/post/:id', authenticateToken, isVerify, async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    try {

        const postDelete = await Posts.findById(id);

        const userId = req.user?.id
        if (postDelete)
            if (postDelete.user == req.user?.id) {
                await postDelete.deleteOne()

                const userUpdate = await Usuario.findByIdAndUpdate(
                    { userId },
                    { $pull: { posts: id } }
                )

                res.status(201).json(postDelete)
            }
            else
                res.status(500).json({
                    mensage: 'Poster realizado por outro usuário'
                })

        else
            res.status(404).json({
                mensage: 'Post não encontrado'
            })

    } catch (error: any) {
        res.status(500).json({
            mensage: error
        })
    }
})