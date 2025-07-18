import { Router } from "express";
import { signup,login,logout, checkAuth } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const authRouter = Router();


authRouter.post("/signup",signup)
authRouter.post("/login",login)
authRouter.post("/logout",logout)

authRouter.get("/check",protectRoute,checkAuth)



export default authRouter;