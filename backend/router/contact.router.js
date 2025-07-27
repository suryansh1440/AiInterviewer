import express from "express";
import getUserContacts from "../controller/contact.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const contactRouter = express.Router();

contactRouter.route("/").post(protectRoute, getUserContacts);

export default contactRouter;
