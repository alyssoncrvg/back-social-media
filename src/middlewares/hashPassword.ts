import bcrypt from 'bcrypt';
import { IUser } from '../../interfaces/user';

export const hashPassword = async function (this: IUser, next: Function) {
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        return next(error as Error);
    }
};
