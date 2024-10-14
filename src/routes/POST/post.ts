import { Response, Request, Router } from "express";
import { Posts, Usuario } from "../../db/models";
import { authenticateToken } from "../../middlewares/authenticateToken";
import { AuthenticatedRequest } from "../../../interfaces/authenticated";

export const postsRouterPost = Router().post('/post', authenticateToken ,async (req: AuthenticatedRequest, res: Response) => {
    const { mensage } = req.body;
    const user = req.user?.id; // Pegue o usuário autenticado
    try {

        const trimmedMessage = mensage.trimStart();

        const hasLetterOrNumber = /.+/.test(trimmedMessage);

        if (hasLetterOrNumber) {
            const existingUser = await Usuario.findById(user);
            if (existingUser) {

                const date = new Date()
                const likes = 0

                const post = new Posts({
                    mensage: trimmedMessage,
                    date: date,
                    user: user,
                    likes: likes
                })

                const postSave = await post.save()

                await Usuario.findByIdAndUpdate(user, { $push: { posts: postSave._id } });

                res.status(201).json(postSave)
            }
        } else {
            res.status(400).json({
                mensage: 'Não há conteúdo no post'
            })
        }


    } catch (error: any) {
        if (error.kind === "ObjectId") {
            res.status(400).json({
                message: 'ID de usuário inválido.'
            });
        }

        else {
            res.status(500).json({
                message: 'Erro ao tentar criar o post',
                error: error.message
            });
        }
    }
})