import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../interfaces/authenticated";
import { Usuario } from "../db/models";

export const isVerify = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = await Usuario.findById(req.user.id);

    try {
        if (user) {
            if (!user.isVerify) {
                res.status(403).json({ message: 'Verifique seu email para acessar esta funcionalidade.' });
            } else {
                next();
            }
        } else {
            res.status(404).json({
                mensage: 'Usuário não encontrado'
            })
        }
    } catch (error){
        res.status(500).json({
            mensage: error
        })
    }
};
