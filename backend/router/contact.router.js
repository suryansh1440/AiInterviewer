import express from "express";
import { createContact} from "../controller/contact.controller.js";

const contactRouter = express.Router();

// User: submit contact form
contactRouter.post("/", createContact);

export default contactRouter;
