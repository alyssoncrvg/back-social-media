import { Router, Response } from "express";
import { Posts } from "../../db/models";
import { authenticateToken } from "../../middlewares/authenticateToken";
import { AuthenticatedRequest } from "../../../interfaces/authenticated";

export const postsRouterDelete = Router().delete('/post/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    try {

        const postDelete = await Posts.findById(id);

        console.log(postDelete?.user)
        console.log(req.user?.id)
        if (postDelete)
            if (postDelete.user == req.user?.id) {
                postDelete.deleteOne()
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