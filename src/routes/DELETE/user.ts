import { Router, Response } from "express";
import { Posts, Usuario } from "../../db/models";
import { AuthenticatedRequest } from "../../../interfaces/authenticated";
import { authenticateToken } from "../../middlewares/authenticateToken";
import { isVerify } from "../../middlewares/isVerify";

export const userRouterDelete = Router().delete('/user/:userName', authenticateToken, isVerify, async (req: AuthenticatedRequest, res: Response) => {
    const id = req.user.id;

    try {

        const userDelete = await Usuario.findByIdAndDelete(id);
        if (userDelete) {

            await Posts.deleteMany({ user: id });

            const updatedFollowers = await Usuario.updateMany(
                { followers: id },
                {
                    $pull: { followers: id },
                    $inc: { numberFollowers: -1 }
                }
            );

            const updatedFollowing = await Usuario.updateMany(
                { following: id },
                {
                    $pull: { following: id },
                    $inc: { numberFollowing: -1 }
                }
            );

            res.status(201).json({
                message: 'Usuário deletado com sucesso',
                user: userDelete
            });
        } else {
            res.status(404).json({
                message: 'Usuário não encontrado',
            });
        }

    } catch (error: any) {

        res.status(500).json({
            mensage: error
        })
    }
})