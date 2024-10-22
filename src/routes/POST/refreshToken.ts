import { Router, Response } from "express";
import { AuthenticatedRequest } from "../../../interfaces/authenticated";
import jwt from 'jsonwebtoken';
import config from "../../../config";

export const refreshTokenRouterPost = Router().post('/refreshToken', async (req: AuthenticatedRequest, res: Response) => {
    const { refreshToken } = req.body
    const { jwt_secret, refresh_secret } = config;

    try {
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, refresh_secret);

            if (decoded && typeof decoded !== 'string') {
                const accessToken = jwt.sign({ id: decoded.id, user: decoded.user, name: decoded.name, profileUrl: decoded.profileUrl }, jwt_secret, { expiresIn: '30d' });
                const newRefreshToken = jwt.sign({ id: decoded.id, user: decoded.user, name: decoded.name, profileUrl: decoded.profileUrl }, refresh_secret, { expiresIn: '7d' });

                res.status(201).json({ accessToken, refreshToken: newRefreshToken });
            } else {
                res.status(403).json({
                    message: 'Token inválido, realizar login novamente'
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            mensage: 'Erro ao processar renovação do token', error
        })
    }
})