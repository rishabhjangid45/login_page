import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true ,unique: true},
    password: { type: String, required: true },
    VerifyOtp: { type: String, default: ''},
    VerifyOtpExpiry: { type: Number, default: 0 },
    isaccountVerified: { type: Boolean, default: false },
    ResetPasswordOtp: { type: String, default: '' },
    ResetPasswordOtpExpiry: { type: Number, default: 0 },
});

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

export default UserModel;