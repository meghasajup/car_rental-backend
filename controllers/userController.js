import { User } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { generateUserToken } from '../utils/generateToken.js';
import { validateUserLogin, validateUserRegistration } from '../validation/userJoi.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cloudinaryInstance } from '../config/cloudinaryConfig.js';

export const userCreate = asyncHandler(async (req, res, next) => {
    const { error } = await validateUserRegistration(req.body);
    if (error) {
        return res.status(402).json({ success: false, message: error.details[0].message });
    }

    const { name, email, password, phone, profileImage } = req.body;

    // Check if user exists
    const userExist = await User.findOne({ email });
    if (userExist) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash the password
    const salt = 10;
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Upload profile image to Cloudinary
    let profileImageUrl = '';
    if (req.file) {
        const result = await cloudinaryInstance.uploader.upload(req.file.path);
        profileImageUrl = result.secure_url;
    }

    // Save new user
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        phone,
        profileImage: profileImageUrl,
    });

    await newUser.save();

    // Generate token
    const token = generateUserToken(email);
    res.cookie('token', token);
    res.json({ success: true, message: "User created successfully" });
});





//login
export const userLogin = asyncHandler(async (req, res, next) => {
    const { error } = validateUserLogin(req.body);
    if (error) {
        return res.status(402).json({ success: false, message: error.details[0].message });
    }

    const { email, password } = req.body;

    //Check user exist or not
    const userExit = await User.findOne({ email })
    if (!userExit) {
        return res.status(400).json({ success: false, message: 'User does not exist' })
    }

    const passwordMatch = bcrypt.compareSync(password, userExit.password)
    if (!passwordMatch) {
        return res.status(400).json({ success: false, message: 'Invalid email or password' })
    }

    //Token
    const token = generateUserToken(email)
    res.cookie('token', token)
    res.json({ success: true, message: 'Login successfully' })
});



//User profile
export const userProfile = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const userData = await User.findById(id).select("-password")
    res.json({ success: true, message: 'User data fetched', data: userData })
});



//Check User
export const checkUser = asyncHandler(async (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ success: false, message: 'User not authenticated' })
    }
    res.json({ success: true, message: 'User is authenticated' })
});



// Logout
export const userLogout = asyncHandler(async (req, res, next) => {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out successfully' });
});