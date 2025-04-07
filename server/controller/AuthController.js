import { request, response } from "express";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken"
import { compare } from "bcrypt";
import {renameSync,unlinkSync} from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000

const createToken = (email,userId) => {
    return jwt.sign({email, userId},process.env.JWT_KEY,{expiresIn: maxAge})
}

export const signup = async (req,res) => {
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).send('Email and password is required')
        }

        const user = await User.create({email,password});

        res.cookie('jwt',createToken(email,user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        })
        return res.status(201).json({user:{
            id:user.id,
            email: user.email,
            profileSetup: user.profileSetup,
        }})

    }
    catch(error) {
        console.error(error)
        return res.status(500).send("internal server error");
    }
}


export const login = async (req,res) => {
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).send('Email and password is required')
        }

        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).send('User with the given email is not found')
        }

        const auth = await compare(password, user.password)

        if(!auth) {
            return res.status(400).send("password is incorrect")
        }

        res.cookie('jwt',createToken(email,user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        })
        return res.status(200).json({user:{
            id:user.id,
            email: user.email,
            profileSetup: user.profileSetup,
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.images,
            color: user.colors
        }})

    }
    catch(error) {
        console.error(error)
        return res.status(500).send("internal server error");
    }
}


export const getUserInfo = async (req,res,next) => {
    try {

        console.log(req.userId)

        const userData = await User.findById(req.userId);

        if(!userData) {
            return res.status(404).send("User with the given id not found")
        }
        

        return res.status(200).json({
            id:userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.images,
            color: userData.color
        })

    }
    catch(error) {
        console.error(error)
        return res.status(500).send("internal server error");
    }
}



export const updateProfile = async (req,res,next) => {
    try {

        const {userId} = req;
        console.log(userId)
        const { firstName,lastName, colors} = req.body;
        console.log(req.userId)
        console.log(firstName+lastName+colors)

        if(!firstName || !lastName){
            return res.status(400).send("firstname or lastname are requireddd")
        }

        const userData = await User.findByIdAndUpdate(userId,{
            firstName,
            lastName,
            colors,
            profileSetup: true
        },{new: true,runValidators: true})
        // const userData = await User.findById(req.userId);

        if(!userData) {
            return res.status(404).send("User with the given id not found")
        }
        

        return res.status(200).json({
            id:userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.images,
            color: userData.colors
        })

    }
    catch(error) {
        console.error(error)
        return res.status(500).send("internal server error");
    }
}




export const addProfileImage = async (req,res,next) => {
    try {
        if(!req.file) {
            return response.status(400).send("file is required");

        }

        const date = Date.now();
        let fileName = "uploads/profiles/"+ date + req.file.originalname;
        renameSync(req.file.path,fileName)

        console.log(fileName)
        console.log(req.userId)

        const updateUser = await User.findByIdAndUpdate(req.userId,{images:fileName},{new:true, runValidators: true});



        // const {userId} = req;
       

        return res.status(200).json({
          image: updateUser.images,  
        })

    }
    catch(error) {
        console.error(error)
        return res.status(500).send("internal server error");
    }
}


export const removProfileImage = async (req,res,next) => {
    try {

        const {userId} = req;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).send('User not found');
        }

        if( user.images){
            unlinkSync(user.images);
        }

        user.images = null;
        await user.save();
       


        return res.status(200).send("Profile image removed successfully")

    }
    catch(error) {
        console.error(error)
        return res.status(500).send("internal server error");
    }
}




export const logout = async (req,res,next) => {
    try {
        res.cookie('jwt', "",{maxAge:1,secure:true,sameSite:"None"})

        return res.status(200).send("Logout successfull")
    }
    catch(error) {
        console.error(error)
        return res.status(500).send("internal server error");
    }
}



