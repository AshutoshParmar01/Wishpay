import express, { Response } from "express"
import zod from "zod"
import JWT_SECRET from "../config";
import db from "../db"

import jwt from "jsonwebtoken"
import { Request } from "express";
import { authMiddleware } from "../middleware";
const router = express.Router();

const signupSchema = zod.object({
    username : zod.string(),
    password : zod.string(),
    firstName : zod.string(),
    lastName : zod.string()
});

interface AuthenticatedReq extends Request{
    userId?: string
}

router.post("/signup", async (req, res) =>{
    const body = req.body
    const {success} = signupSchema.safeParse(req.body)
    if (!success){
        res.status(411).json({
            message:"incorrect inputs"
        })
        return
    }
    const user = await db.User.findOne({
        username : body.username
    });

    if (user?._id){
        res.status(411).json({
            message:"user already exists"
        })
        return
    }
    const dbUser = await db.User.create(body);

    await db.Account.create({
        userId: dbUser._id,
        balance: 1000
    });
    const token = jwt.sign({
        userId: dbUser._id
    },JWT_SECRET)
    res.json({
        message:"User created succesfully",
        token: token
    })
})

const signinBody = zod.object({
    username : zod.string().email(),
    password : zod.string()
})
router.post("/signin", async(req:Request,res:Response) =>{
    const {success} = signinBody.safeParse(req.body)
    if(!success){
        res.status(411).json({
            message:'Email already taken / incorrect inputs'
        })
        return
    }

    const user = await db.User.findOne({
        username: req.body.username,
        password:req.body.password
    })

    if(user){
        const token = jwt.sign({
        userId: user?._id
    },JWT_SECRET);

    res.json({
        token:token
    })
    return;
    }

    res.status(411).json({
        msg:"Error while logging in"
    })
});

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})

router.put("/update",authMiddleware, async (req:AuthenticatedReq, res:Response) => {
    const {success} = signupSchema.safeParse(req.body);
    if(!success){
        res.status(411).json({
            message:"error while updation"
        })
        return
    };
    await db.Account.updateOne({
        id: req.userId
    },req.body)

    res.json({
        msg:"Updated successfully"
    })
})

router.get("/bulk",async(req:Request,res:Response)=>{
    const filter = req.query.filter || "";
    const users = await db.User.find({
        $or:[{
            firstName:{
                $regex:filter
            }
        },{
            lastName:{
                $regex:filter
            }
        }]
        
    })

    res.json({
        user:users.map(user=>({
            username:user.username,
            firstName:user.firstName,
            lastName:user.lastName,
            _id:user._id
        }))
    })

})

export default router