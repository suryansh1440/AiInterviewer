import jwt from "jsonwebtoken"


export const generateToken = (userId,res) =>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
    res.cookie("jwt",token,{
        maxAge: 7 * 24 * 60 * 60 * 1000, //ms
        httpOnly: true,
        sameSite: "lax", // Changed from "strict" to "lax" for cross-domain
        secure: process.env.NODE_ENV === "production",
        domain: process.env.NODE_ENV === "production" ? undefined : undefined
    })
    return token;
}