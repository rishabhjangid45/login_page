import bcrypt from 'bcryptjs';
import UserModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import transporter from '../config/nodemailer.js';

dotenv.config();



export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password){
        return res.json({ success: false, message: 'All fields are required' });
    }
    try {
        const existingUser = await UserModel.findOne({ email });
        if(existingUser) return res.json({ success: false, message: 'User already exists' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword });
        await newUser.save();
        
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'defaultSecret', { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict' , maxAge: 7 * 24 * 60 * 60 * 1000 });
        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to : email ,
            subject : 'welcome to rishabh website',
            text : `your account has been created with email id : ${email}`
        }
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }


};


export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.json({ success: false, message: 'All fields are required' });
    }
    
    // Add debug logging
    console.log('JWT_SECRET:', process.env.JWT_SECRET || 'defaultSecret');
    
    try {
        const user = await UserModel.findOne({ email });
        if(!user) return res.json({ success: false, message: 'User not found' });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) return res.json({ success: false, message: 'Invalid password' });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'defaultSecret', { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict' , maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.json({ success: true, message: 'User logged in successfully', user });
    } catch (error) {
        console.error('Login error:', error);
        res.json({ 
            success: false, 
            message: 'Error logging in user', 
            error: error.message || 'Internal server error' 
        });
    }
};

export const logoutUser = async (req, res) => {

    try {
        res.clearCookie('token' , { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'  });
        res.json({ success: true, message: 'User logged out successfully' });
    } catch (error) {
        res.json({ success: false, message: 'Error logging out user', error });
    }
};

export const sendVerifyOtp = async (req, res) => {
    const { email } = req.body;
    if(!email){
        return res.json({ success: false, message: 'All fields are required' });
    }
    try {
       const {email , userId} = req.body;
       const user = await UserModel.findOne({email});
       if(user.isaccountVerified){
        return res.json({ success: false, message: 'User is already verified' });
       }
       const otp = String(Math.floor(100000 + Math.random() * 900000));
       user.VerifyOtp = otp;
       user.VerifyOtpExpiry = Date.now() + 15 * 60 * 1000;
       await user.save();
       const mailOptions = {
           from : process.env.SENDER_EMAIL,
           to : user.email ,
           subject : 'verify your account',
           text : `your verify otp is : ${otp}`
       }
       await transporter.sendMail(mailOptions);
       res.json({ success: true, message: 'Otp sent successfully' });
       }
     catch (error) {
       res.json({ success: false, message: error.message });
    }

};

export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;
    if(!userId || !otp){
        return res.json({ success: false, message: 'All fields are required' });
    }
    try {
        const user = await UserModel.findById(userId);
        if(!user) return res.json({ success: false, message: 'User not found' });
        if(user.VerifyOtp !== otp || user.VerifyOtp === '') return res.json({ success: false, message: 'Invalid otp' });
        if(user.VerifyOtpExpiry < Date.now()) return res.json({ success: false, message: 'Otp has expired' });
        user.isaccountVerified = true;
       
        user.VerifyOtp = '';
        user.VerifyOtpExpiry = 0;
        await user.save();
        res.json({ success: true, message: 'User verified successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }

};

export const isauthenticated = async (req, res) => {
    try {
        const user = await UserModel.findById(req.body.userId);
        if(!user) return res.json({ success: false, message: 'User not found' });
        res.json({ success: true, message: 'User is authenticated', user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const sendResetPasswordOtp = async (req, res) => {
    const { email } = req.body;
    if(!email){
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    try {
       const user = await UserModel.findOne({ email });
       if(!user) return res.json({ success: false, message: 'User not found' });
       const otp = String(Math.floor(100000 + Math.random() * 900000));
       user.ResetPasswordOtp = otp;
       user.ResetPasswordOtpExpiry = Date.now() + 15 * 60 * 1000;
       await user.save();
       const mailOptions = {
           from : process.env.SENDER_EMAIL,
           to : user.email ,
           subject : 'reset your password',
           text : `your reset password otp is : ${otp}`
       }
       await transporter.sendMail(mailOptions);
       res.json({ success: true, message: 'Otp sent successfully' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }   

};

export const resetPassword = async (req, res) => {
    const { email, otp, newpassword } = req.body;
    if(!email || !otp || !newpassword){
        return res.json({ success: false, message: 'All fields are required' });
    }
    try {
        const user = await UserModel.findOne({email});
        if(!user) return res.json({ success: false, message: 'User not found' });
        if(user.ResetPasswordOtp !== otp || user.ResetPasswordOtp === '') return res.json({ success: false, message: 'Invalid otp' });
        if(user.ResetPasswordOtpExpiry < Date.now()) return res.json({ success: false, message: 'Otp has expired' });
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        user.password = hashedPassword;
        user.ResetPasswordOtp = '';
        user.ResetPasswordOtpExpiry = 0;
        await user.save();
        res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }

};

export const isOtpValid = async (req, res) => {
    const { email, otp } = req.body;
    console.log(req.body);
    if(!email || !otp){
        return res.json({ success: false, message: 'All fields are required' });
    }
    try {
        const user = await UserModel.findOne({email});
        if(!user) return res.json({ success: false, message: 'User not found' });
        if(user.ResetPasswordOtp !== otp || user.ResetPasswordOtp === '') return res.json({ success: false, message: 'Invalid otp' });
        if(user.ResetPasswordOtpExpiry < Date.now()) return res.json({ success: false, message: 'Otp has expired' });
        res.json({ success: true, message: 'Otp is valid' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};