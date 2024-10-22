import { Router, Response } from "express";
import { AuthenticatedRequest } from "../../../../interfaces/authenticated";
import { Posts } from "../../../db/models";
import { authenticateToken } from "../../../middlewares/authenticateToken";
import { isVerify } from "../../../middlewares/isVerify";

export const searchPostsRouterGet = Router().get('/search/posts/:context', authenticateToken, isVerify, async (req: AuthenticatedRequest, res: Response) => {

    const { context } = req.params;

    try {

        const posts = await Posts.find({
            mensage: {
                $regex: context,
                $options: 'i'
            }
        })
            .populate('user', 'user name profileImage')

        if (posts) {
            res.status(201).json(posts)
        } else {
            res.status(404).json({ mensage: 'Nenhum post enocntrado' })
        }

    } catch (error) {
        res.status(500).json({
            mensage: 'Erro ao processar a requisição', error
        })
    }

})