import mongoose, { Schema, Document } from "mongoose";
import config from "../../config";
import bcrypt from 'bcrypt';
import { IUser } from "../../interfaces/user";

const { mongo_uri } = config

const connectDB = async () => {
  try {
    await mongoose.connect(mongo_uri!);
    console.log("Conexão com o MongoDB Atlas realizada com sucesso.");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB", error);
    process.exit(1);
  }
};

connectDB()

const usuarioSchema = new Schema({
  user: { type: String, unique: true, require: true },
  name: { type: String, require: true },
  password: { type: String, require: true },
  register: { type: Date, require: true },
  followers: [{ type: Schema.Types.ObjectId, ref: 'Usuario' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'Usuario' }],
  numberFollowers: { type: Number, require: true },
  numberFollowing: { type: Number, require: true },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Posts' }]
})

const postsSchema = new Schema({
  mensage: { type: String, require: true },
  date: { type: Date, require: true },
  user: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
  likes: { type: Number, require: true }
})

// Middleware para criptografar a senha antes de salvar
usuarioSchema.pre<IUser>('save', async function (next) { 
  const user = this; 
    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10); // 10 é o número de rounds
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        return next(error as Error);
    }
});

// Método para verificar se a senha fornecida corresponde à senha armazenada
usuarioSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const Usuario = mongoose.model('Usuarios', usuarioSchema)
export const Posts = mongoose.model('Posts', postsSchema)