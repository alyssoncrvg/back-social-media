import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    user: string;
    name: string;
    password: string;
    register: Date;
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    numberFollowers: number;
    numberFollowing: number;
    posts: mongoose.Types.ObjectId[];
    refreshToken?: string;
    isVerify: boolean,
    comparePassword(candidatePassword: string): Promise<boolean>;
}

