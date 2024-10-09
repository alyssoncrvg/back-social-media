import mongoose, { Schema } from "mongoose";
import config from "../../config";

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

const usuario = new Schema({
  user: { type: String, unique: true, require: true },
  name: { type: String, require: true },
  register: { type: Date, require: true },
  followers: [{ type: Schema.Types.ObjectId, ref: 'Usuario' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'Usuario' }],
  numberFollowers: { type: Number, require: true },
  numberFollowing: { type: Number, require: true },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Posts' }]
})

const posts = new Schema({
  mensage: { type: String, require: true },
  date: { type: Date, require: true },
  user: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
  likes: { type: Number, require:true }
})


export const Usuario = mongoose.model('Usuarios', usuario)
export const Posts = mongoose.model('Posts', posts)