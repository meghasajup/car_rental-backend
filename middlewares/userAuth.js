import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js'; 

export const authUser = async (req, res, next) => {
    const { token } = req.cookies;
    console.log("Token received: ", token);

    if (!token) {
        return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log("Token decoded: ", decoded);

        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        req.user = user;  
        next();
    } catch (err) {
        console.error("Token Verification Error:", err);
        return res.status(400).json({ success: false, message: "Invalid token" });
    }
};
