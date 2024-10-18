import { Router, Request, Response } from "express";
import { Usuario } from "../../db/models";
import jwt from 'jsonwebtoken';
import config from "../../../config";
import { sendEmail } from "../../middlewares/sendEmailVerify";

export const usuarioPostRouter = Router().post('/users', async (req: Request, res: Response) => {
    const { user, name, password, email } = req.body;
    const { jwt_secret, refresh_secret, servidor } = config

    try {
        const userLow = user.trimStart().toLowerCase()
        if (/.+/.test(userLow)) {
            const date = new Date();
            const followers: Array<string> = [];
            const following: Array<string> = [];
            const numberFollowers = 0
            const numberFollowing = 0
            const posts: Array<string> = [];

            const registerUser = new Usuario({
                user: userLow,
                name: name,
                password: password,
                email: email,
                register: date,
                followers: followers,
                following: following,
                numberFollowers: numberFollowers,
                numberFollowing: numberFollowing,
                posts: posts,
                isVerify: false,
            })

            const saveUser = await registerUser.save()

            const verificationToken = jwt.sign({ id: saveUser._id }, jwt_secret, { expiresIn: '1d' });

            const verificationLink = `${servidor}/api/verify/${verificationToken}`;
            const subject = 'Verifique sua conta';
            const text = `Olá ${name}, clique no link para verificar sua conta: ${verificationLink}`;
    
            await sendEmail(email, subject, text);

            const accessToken = jwt.sign({ id: saveUser._id, user: saveUser.user }, jwt_secret, { expiresIn: '15m' });
            const newRefreshToken = jwt.sign({ id: saveUser._id, user: saveUser.user }, refresh_secret, { expiresIn: '7d' });
    
            res.status(201).json({ message: 'Usuário criado. Verifique seu email para ativar sua conta.', accessToken: accessToken, refreshToken: newRefreshToken });
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
        } else {
            res.status(500).json({
                message: 'Erro ao tentar criar usuário'
            })
        }
    }
})