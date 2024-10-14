import { Response, Request, Router } from "express";
import { Posts, Usuario } from "../../db/models";

export const postsRouterPost = Router().post('/post', async (req: Request, res: Response) => {
    const { mensage, user } = req.body;
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
                    date,
                    user,
                    likes
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