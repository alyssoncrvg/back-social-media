import { Router, Response } from "express";
import { AuthenticatedRequest } from "../../../../interfaces/authenticated";
import { Usuario } from "../../../db/models";
import jwt from 'jsonwebtoken';
import config from "../../../../config";

export const verifyRouterGet = Router().get('/verify/:token', async (req: AuthenticatedRequest, res: Response) => {

    const { token } = req.params;
    const { jwt_secret_verify } = config;

    try {

        const decoded = jwt.verify(token, jwt_secret_verify)

        if (decoded && typeof decoded !== 'string') {
            const user = await Usuario.findById(decoded.id)
            if (user) {
                if (!user.isVerify) {
                    user.isVerify = true;
                    await user.save()

                    res.status(201).json({
                        mensage: 'Usuário verificado com sucesso!',
                    })
                } else {
                    res.status(400).json({
                        mensage: 'Usuário já autenticado'
                    })
                }
            } else {
                res.status(403).json({
                    mensage: 'Usuário não encontrado'
                })
            }
        } else {
            res.status(403).json({
                mensage: 'Token inspirado ou inválido'
            })
        }
    } catch (error) {
        res.status(500).json({
            mensage: 'Erro ao processar verificação'
        })
    }
})