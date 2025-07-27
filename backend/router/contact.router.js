import express from "express";
import getUserContacts from "../controller/contact.controller.js";

const contactRouter = express.Router();

contactRouter.route("/").post(getUserContacts);

export default contactRouter;
