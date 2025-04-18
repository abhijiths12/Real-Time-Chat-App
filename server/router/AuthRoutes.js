import { Router } from "express";
import { addProfileImage, getUserInfo, login, logout, removProfileImage, signup, updateProfile } from "../controller/AuthController.js";
import { verifyToken } from "../middlewares/Authmiddleware.js";

import multer from "multer";


const authRoutes = Router();

const upload = multer({dest:"uploads/profiles/"});



authRoutes.post('/signup',signup)
authRoutes.post('/login',login)
authRoutes.get('/user-info',verifyToken,getUserInfo)
authRoutes.post('/update-profile',verifyToken,updateProfile)
authRoutes.post("/add-profile-image",verifyToken, upload.single('profile-image'),addProfileImage)


authRoutes.delete("/remove-profile-image",verifyToken, removProfileImage) 
authRoutes.post('/logout',logout)


export default authRoutes