import { Router } from "express";
import { signup,login,logout, checkAuth, updateProfile, changePassword, deleteAccount,getAllUsers, googleLogin, githubLogin, githubCallback } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const authRouter = Router();


authRouter.post("/signup",signup)
authRouter.post("/login",login)
authRouter.post("/logout",logout)
authRouter.post("/google-login", googleLogin)
authRouter.get("/github", githubLogin);
authRouter.get("/github/callback", githubCallback);

authRouter.get("/check",protectRoute,checkAuth)
authRouter.put("/update-profile",protectRoute,updateProfile)
authRouter.put("/changePassword",protectRoute,changePassword)
authRouter.post("/delete-account",protectRoute,deleteAccount)
authRouter.post("/get-users",protectRoute,getAllUsers)



export default authRouter;