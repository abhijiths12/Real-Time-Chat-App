import { Router } from "express";
import { getContactsForDMlist, searchContacts } from "../controller/ContactsController.js";
import { verifyToken } from "../middlewares/Authmiddleware.js";
verifyToken

const contactsRoutes = Router();

contactsRoutes.post('/search',verifyToken,searchContacts)
contactsRoutes.get('/get-contacts-for-dm',verifyToken,getContactsForDMlist)

export default contactsRoutes