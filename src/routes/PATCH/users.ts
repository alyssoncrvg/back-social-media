import { Router, Request, Response } from "express";
import { Usuario } from "../../db/models";
import { AuthenticatedRequest } from "../../../interfaces/authenticated";
import { authenticateToken } from "../../middlewares/authenticateToken";
import { isVerify } from "../../middlewares/isVerify";
import { upload } from "../../../config";

export const userRouterPatch = Router().patch('/user/:userName', authenticateToken, isVerify, upload.single('profileImage'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    console.log(req.user)
    const id = req.user?.id;
    const { user, name, email } = req.body;

    try {
        const userLow = user.trimStart().toLowerCase()
        if (/.+/.test(userLow)) {
            const userEditado = await Usuario.findByIdAndUpdate(
                id,
                { user: user, name: name, email: email },
                { new: true, runValidators: true }
            )

            res.status(201).json(userEditado)
        } else {
            res.status(400).json({
                mensage: 'Nome de usuário incompatível'
            })
        }
    } catch (error: any) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.user) {
            res.status(400).json({
                message: `O nome de usuário '${error.keyValue.user}' já está em uso. Por favor, escolha outro.`
            });
            return;
        }

        if (error.kind === 'ObjectId') {
            res.status(400).json({
                message: 'ID de usuário inválido.'
            });
            return;
        }

        res.status(500).json({
            message: 'Erro ao tentar atualizar o usuário',
            error: error.message
        });
    }
})