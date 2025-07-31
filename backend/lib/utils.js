import jwt from "jsonwebtoken"


export const generateToken = (userId,res) =>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
    
    // Cookie settings for production
    const cookieOptions = {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: "none", // Required for cross-origin
        secure: true, // Required when sameSite is "none"
        path: "/"
    }
    
    res.cookie("jwt", token, cookieOptions);
    return token;
}