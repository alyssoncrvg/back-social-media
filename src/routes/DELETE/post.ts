import { Router, Request, Response } from "express";
import { Posts } from "../../db/models";

export const postsRouterDelete = Router().delete('/post/:id', async (req: Request, res: Response) => {

    const { id } = req.params;

    try {

        const postDelete = await Posts.findByIdAndDelete(id);

        if (postDelete)
            res.status(201).json(postDelete)

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