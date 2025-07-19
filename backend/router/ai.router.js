import { Router } from "express";
import { readPdf } from "../controller/ai.controller.js";

const aiRouter = Router();

aiRouter.post("/readPdf",readPdf)


export default aiRouter;