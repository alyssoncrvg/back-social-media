import bcrypt from 'bcrypt';
import { IUser } from '../../interfaces/user';

export const comparePassword = async function (this: IUser, candidatePassword: string): Promise<boolean> {
  const user = this;
  return await bcrypt.compare(candidatePassword, user.password);
};
