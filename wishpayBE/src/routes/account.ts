import express from "express";
import { Request, Response } from "express";
import { authMiddleware } from "../middleware";
import db from "../db";
import mongoose from "mongoose";

mongoose.connect("mongodb+srv://ashu:Ashu@cluster0.xxwkjxh.mongodb.net/");
const router = express.Router();

router.get("/balance",authMiddleware,async(req:Request, res:Response)=>{
    const account = await db.Account.findOne({
        userId: (req as any).userId
    });
    res.json({
        balance: account?.balance
    });
})

router.post("/transfer",authMiddleware, async(req:Request, res:Response)=>{
    const session = await mongoose.startSession();
    session.startTransaction();
    const {amount, to} = req.body;

    const senderAccount = await db.Account.findOne({
        userId: (req as any).userId
    }).session(session);

    if(!senderAccount || senderAccount.balance < amount){
        await session.abortTransaction();
        return res.status(400).json({message:"insufficient balance"})
    }

    const toAccount = await db.Account.findOne({
        userId: to
    }).session(session);
    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({message:"receiver account not found"})
    }

    await db.Account.updateOne({userId: (req as any).userId},{
        $inc: {balance: -amount}
    }).session(session);

    await db.Account.updateOne({userId: to},{
        $inc: {balance: amount}
    }).session(session);

    await session.commitTransaction();

    res.json({message:"transfer successful"});
});

export default router