import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario } from '../../db/models';
import { IUser } from '../../../interfaces/user';
import config from '../../../config';

export const loginRouterPost = Router().post('/login', async (req: Request, res: Response) => {
    const { user, password } = req.body;
    const { jwt_secret, refresh_secret } = config

    try {
        const foundUser: IUser | null = await Usuario.findOne({ user });

        if (foundUser) {
            const isMatch = await foundUser.comparePassword(password);
            if (isMatch) {
                const acessToken = jwt.sign({ id: foundUser._id, user: foundUser.user }, jwt_secret, { expiresIn: '15m' });

                const refreshToken = jwt.sign({ id: foundUser._id, user: foundUser.user }, refresh_secret, { expiresIn: '7d' });

                res.status(200).json({ acessToken: acessToken, refreshToken: refreshToken, user: foundUser });
            } else {
                res.status(401).json({ message: 'Senha incorreta' });
            }
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});