// const express = require('express')
import express from 'express'
import dotenv from "dotenv"
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from './router/AuthRoutes.js';
import contactsRoutes from './router/ContactRoutes.js';
import setupSocket from './socket.js';
import messagesRoutes from './router/MessagesRoutes.js';


dotenv.config();

const app = express();
const port = process.env.PORT 
const databaseURL = process.env.DATABASE_URL;

app.use(cors({
    origin:[process.env.ORIGIN],
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials: true,
}))


app.use("/uploads/profiles", express.static("uploads/profiles"))

app.use(cookieParser())

app.use(express.json());


app.use('/api/auth',authRoutes)
app.use('/api/contacts',contactsRoutes)
app.use('/api/messages',messagesRoutes)

app.get('/',(req,res) => {
    res.status(200).send("hello from the backend")
})

const server = app.listen(port,() => {
    console.log(`server is running at port ${port}`);
})

setupSocket(server)

mongoose.connect(databaseURL).then(() => console.log('DB connection successful')).catch(err => console.log(err.message))