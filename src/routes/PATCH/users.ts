import { Router, Request, Response } from "express";
import { Usuario } from "../../db/models";

export const userRouterPatch = Router().patch('/user/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { user, name } = req.body;

    try {
        const userLow = user.trimStart().toLowerCase()
        if (/.+/.test(userLow)) {
            const userEditado = await Usuario.findByIdAndUpdate(
                id,
                { user: user, name: name },
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

        // Verifica se o erro está relacionado a um ObjectId inválido
        if (error.kind === 'ObjectId') {
            res.status(400).json({
                message: 'ID de usuário inválido.'
            });
            return;
        }

        // Qualquer outro erro
        res.status(500).json({
            message: 'Erro ao tentar atualizar o usuário',
            error: error.message
        });
    }
})