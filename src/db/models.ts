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
    user: {type:String, unique:true, require:true},
    name: {type:String, require:true},
    register: {type: Date, require:true},
    followers: {type: Number, require:true},
    following: {type: Number, require:true}
})


export const Usuario = mongoose.model('Usuarios', usuario)