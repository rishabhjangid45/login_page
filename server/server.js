import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import nodemon from 'nodemon';
import connectDB from './config/mongodb.js';
const app = express();
const PORT = process.env.PORT || 4000;
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userroutes.js';

connectDB();
const allowedOrigins = ['http://localhost:5173'];
app.use(cors({
    origin:allowedOrigins, // Replace with your frontend URL
    credentials: true,  // This is important for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());
//api endpoints 
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
