import jwt from "jsonwebtoken"


export const generateToken = (userId,res) =>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
    
    // Cookie settings - simplified for better compatibility
    const cookieOptions = {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: "lax",
        secure: false, // Set to false for now to test
        path: "/"
    }
    
    console.log("Setting cookie with options:", cookieOptions);
    res.cookie("jwt", token, cookieOptions);
    console.log("Cookie set successfully");
    return token;
}