import { Router, Request, Response } from "express";
import { Usuario } from "../../db/models";
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';
import config from "../../../config";
import { sendEmail } from "../../middlewares/sendEmailVerify";
import { upload } from "../../../config";

export const usuarioPostRouter = Router().post('/users', upload.single('profileImage'), async (req: Request, res: Response) => {
    const { user, name, password, email } = req.body;
    const { jwt_secret, refresh_secret, servidor, jwt_secret_verify } = config

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
                profileImage: '',
            })

            const saveUser = await registerUser.save()

            let profileImageUrl = '';
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'users',
                    public_id: saveUser._id.toString(),
                    format: 'png',
                });
                profileImageUrl = result.secure_url;
            } else {
                profileImageUrl = "https://res.cloudinary.com/dk9kvqte3/image/upload/v1729608967/users/default.png"
            }

            await Usuario.findByIdAndUpdate(saveUser._id, { profileImage: profileImageUrl });

            const verificationToken = jwt.sign({ id: saveUser._id }, jwt_secret_verify, { expiresIn: '1d' });

            const verificationLink = `${servidor}/api/verify/${verificationToken}`;
            const subject = 'Verifique sua conta';
            const text = `Olá ${name}, clique no link para verificar sua conta: ${verificationLink}`;

            await sendEmail(email, subject, text);

            const accessToken = jwt.sign({ id: saveUser._id, user: saveUser.user, name: saveUser.name, profileUrl: saveUser.profileImage }, jwt_secret, { expiresIn: '15m' });
            const newRefreshToken = jwt.sign({ id: saveUser._id, user: saveUser.user, name: saveUser.name, profileUrl: saveUser.profileImage }, refresh_secret, { expiresIn: '7d' });

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