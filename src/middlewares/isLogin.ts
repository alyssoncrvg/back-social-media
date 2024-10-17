import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import config from '../../config';
import { AuthenticatedRequest } from '../../interfaces/authenticated';

export const isLogin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');

    if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        if (token) {
            try {
                const decoded = jwt.verify(token, config.jwt_secret); 
                req.user = decoded;
                next();
            } catch (error) {
                res.status(400).json({ message: 'Token inválido.' });
            }
        } else {
            res.status(401).json({ message: 'Acesso negado. Token ausente ou malformado.' });
        }


    } else {
        res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });

    }

};
