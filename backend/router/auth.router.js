import { Router } from "express";
import { signup,login,logout, checkAuth, updateProfile, changePassword } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const authRouter = Router();


authRouter.post("/signup",signup)
authRouter.post("/login",login)
authRouter.post("/logout",logout)

authRouter.get("/check",protectRoute,checkAuth)
authRouter.put("/update-profile",protectRoute,updateProfile)
authRouter.put("/changePassword",protectRoute,changePassword)



export default authRouter;