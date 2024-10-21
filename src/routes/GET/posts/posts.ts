import { Router, Response } from "express";
import { Usuario, Posts } from "../../../db/models";
import { AuthenticatedRequest } from "../../../../interfaces/authenticated";
import { authenticateToken } from "../../../middlewares/authenticateToken";
import { isVerify } from "../../../middlewares/isVerify";

export const postsRouterGet = Router().get('/posts', authenticateToken, isVerify, async (req: AuthenticatedRequest, res: Response) => {
    const { latestPostDate, limit } = req.query;
    const userId = req.user?.id

    try {

        const usuario = await Usuario.findById(userId)

        if (usuario) {

            const postLimit = limit ? parseInt(limit as string) : 30;
            const lastDate = latestPostDate ? new Date(latestPostDate as string) : new Date()

            const posts = await Posts.find({
                user: { $in: usuario.following },
                date: { $lte: lastDate }
            })
                .sort({ date: -1 })
                .limit(postLimit)
                .populate('user', 'user name')

            if (posts.length > 0) {
                res.status(201).json({ posts })
            } else {
                res.status(404).json({
                    mensage: 'Nenhum post encontrado'
                })
            }

        } else {
            res.status(404).json({
                mensage: 'Usuário não encontrado'
            })
        }

    } catch (error) {
        res.status(500).json({
            mensage: 'Erro ao processar requisição de posts', error
        })
    }
})