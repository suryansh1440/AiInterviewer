import { Router } from "express";
import { demo } from "../controller/auth.controller.js";


const authRouter = Router();

authRouter.get("/demo",demo);



export default authRouter;