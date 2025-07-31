import jwt from "jsonwebtoken"
import User from "../modals/user.modal.js"

export const protectRoute = async (req,res,next) =>{
    try{
        const token = req.cookies.jwt
        if(!token){
            return res.status(401).json({message:"Unauthorized - No token Provided"})
        }
        
        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            if(!decoded){
                return res.status(401).json({message:"Unauthorized - Invalid Token"});
            }
            const user = await User.findById(decoded.userId).select("-password");
            if(!user){
                return res.status(404).json({message:"user not found"})
            }
            req.user = user
            next()
        } catch (jwtError) {
            // Clear the invalid token
            res.clearCookie("jwt", {
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
            });
            return res.status(401).json({message:"Unauthorized - Token expired or invalid"});
        }

    }catch(error){
        console.log("Error in protectRoute middleware",error.message)
        return res.status(500).json({message:"Internal Server Error"})

    }
}