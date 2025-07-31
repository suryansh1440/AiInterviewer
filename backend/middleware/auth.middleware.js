import jwt from "jsonwebtoken"
import User from "../modals/user.modal.js"

export const protectRoute = async (req,res,next) =>{
    try{
        console.log("Cookies received:", req.cookies);
        console.log("JWT token:", req.cookies.jwt ? "Present" : "Missing");
        
        const token = req.cookies.jwt
        if(!token){
            console.log("No JWT token found in cookies");
            return res.status(401).json({message:"Unauthorized - No token Provided"})
        }
        
        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            console.log("Token decoded successfully for user:", decoded.userId);
            
            if(!decoded){
                return res.status(401).json({message:"Unauthorized - Invalid Token"});
            }
            const user = await User.findById(decoded.userId).select("-password");
            if(!user){
                console.log("User not found for ID:", decoded.userId);
                return res.status(404).json({message:"user not found"})
            }
            console.log("User authenticated:", user.email);
            req.user = user
            next()
        } catch (jwtError) {
            console.log("JWT verification failed:", jwtError.message);
            // Clear the invalid token
            res.clearCookie("jwt", {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                path: "/"
            });
            return res.status(401).json({message:"Unauthorized - Token expired or invalid"});
        }

    }catch(error){
        console.log("Error in protectRoute middleware",error.message)
        return res.status(500).json({message:"Internal Server Error"})

    }
}