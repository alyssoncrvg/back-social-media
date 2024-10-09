import { Router, Request, Response } from "express";
import { Posts } from "../../db/models";

export const postsRouterPatch = Router().patch('/post/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const { mensage } = req.body

    try {

        if (mensage != '') {

            const postUpdate = await Posts.findByIdAndUpdate(
                id,
                { mensage: mensage },
                { new: true, runValidators: true }
            )

            if (!postUpdate) {
                res.status(404).json({
                    mensage: 'Post não encontrado'
                })
            }

            res.status(201).json(postUpdate)
        } else {
            res.status(400).json({
                mensage: 'Campo vazio'
            })
        }

    } catch (error) {
        res.status(500).json({
            mensage: 'Não é possível editar post'
        })
    }
})