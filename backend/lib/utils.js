import jwt from "jsonwebtoken"


export const generateToken = (userId,res) =>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
    
    // Cookie settings for production
    const cookieOptions = {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/"
    }
    
    // Don't set domain in production to let browser handle it
    if (process.env.NODE_ENV !== "production") {
        cookieOptions.domain = undefined;
    }
    
    console.log("Setting cookie with options:", cookieOptions);
    res.cookie("jwt", token, cookieOptions);
    console.log("Cookie set successfully");
    return token;
}