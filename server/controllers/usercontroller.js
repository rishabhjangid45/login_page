import UserModel from "../models/userModel.js";

export const getuserdata = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await UserModel.findById(req.body.userId);
        if (!user) return res.json({ success: false, message: "User not found" });
        res.json({ success: true,
            userData :user.name,
            isaccountVerified:user.isaccountVerified,
            message: "User data fetched successfully", user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};