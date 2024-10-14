import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../../interfaces/authenticated';
import config from '../../config';

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const { jwt_secret } = config;

    if (token) {
        jwt.verify(token, jwt_secret, (err, user) => {
            if (err) {
                res.status(403).json({ message: 'Token inválido ou expirado' });
            } else {
                req.user = user; // Armazena as informações do usuário (id, nome, etc.) no objeto `req`
                next(); // Continue para a próxima função middleware ou rota
            }
        });
    } else {
        res.status(401).json({ message: 'Token não fornecido' });
    }
};