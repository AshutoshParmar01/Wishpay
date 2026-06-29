import JWT_SECRET from "./config";
import jwt from "jsonwebtoken";
import { Request ,Response , NextFunction } from "express"; 


export const authMiddleware = (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers.authorization;
    
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        res.status(403).json({});
        return
    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === "object" && decoded !== null && "userId" in decoded) {
            (req as any).userId = decoded.userId;
            next();
        }
        else{
            return res.status(403).json({});
        }
    } catch (error) {
        return res.status(403).json({});
        } 
};

