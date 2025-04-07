import { Router } from "express";
import { verifyToken } from "../middlewares/Authmiddleware.js";
import { getMessages } from "../controller/MessagesController.js";

const messagesRoutes = Router();

messagesRoutes.post('/get-messages',verifyToken,getMessages)

export default messagesRoutes