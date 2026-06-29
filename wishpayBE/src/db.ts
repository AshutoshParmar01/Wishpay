import { model, Schema } from "mongoose";
import mongoose from "mongoose";

mongoose.connect("mongodb+srv://ashu:Ashu@cluster0.xxwkjxh.mongodb.net/");

const userschema = new Schema({
    username:{ type: String, required: true, unique:true },
    password: { type: String, required: true },
    firstName:{ type: String, required: true },
    lastName: { type: String, required: true }
});

const accountSchema = new Schema({
    userId:{ type:Schema.Types.ObjectId, ref:'User', required:true, unique:true },
    balance:{ type:Number, required:true}
});

const userModel = model('User', userschema);
const accountModel = model('Account', accountSchema);

export default { User:userModel, Account:accountModel };
