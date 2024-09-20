import { User } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { generateUserToken } from '../utils/generateToken.js';
import { validateUserLogin, validateUserRegistration } from '../validation/userJoi.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cloudinaryInstance } from '../config/cloudinaryConfig.js';

export const userCreate = asyncHandler(async (req, res, next) => {
    // Log the request body to see what data is coming from the form
    console.log("Request Body:", req.body);

    // Validate req.body (but not the image, which is in req.file)
    const { error } = await validateUserRegistration(req.body);
    if (error) {
        console.log("Validation Error:", error.details[0].message);
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { name, email, password, phone, username } = req.body;

    // Check if user with the same email or username exists
    const existingEmailUser = await User.findOne({ email });
    const existingUsernameUser = await User.findOne({ username });

    if (existingEmailUser) {
        console.log("User already exists with email:", email);
        return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    // if (existingUsernameUser) {
    //     console.log("User already exists with username:", username);
    //     return res.status(400).json({ success: false, message: 'Username is already taken' });
    // }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Log to ensure password is being hashed
    console.log("Hashed Password:", hashedPassword);

    // Upload profile image to Cloudinary
    let profileImageUrl = '';
    if (req.file) {
        try {
            const result = await cloudinaryInstance.uploader.upload(req.file.path);
            profileImageUrl = result.secure_url;
            console.log("Profile Image Uploaded:", profileImageUrl);
        } catch (err) {
            console.error("Error uploading profile image:", err);
            return res.status(500).json({ success: false, message: "Image upload failed" });
        }
    }

    // Save new user
    try {
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            username,
            profileImage: profileImageUrl,
        });

        await newUser.save();
        console.log("New User Saved:", newUser);

        // Generate token and set cookie
        const token = generateUserToken(email);
        const cookieOptions = {
            sameSite: 'None',
            secure: true,
            httpOnly: true,
        };
        res.cookie("token", token, cookieOptions);

        // Success response
        res.json({ success: true, message: "User created successfully" });
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate key error (e.g., email or username already exists)
            const duplicatedField = Object.keys(error.keyValue)[0];
            console.error("Duplicate Key Error:", duplicatedField, "is already taken");
            return res.status(400).json({
                success: false,
                message: `${duplicatedField.charAt(0).toUpperCase() + duplicatedField.slice(1)} is already taken`
            });
        }
        console.error("Error saving user:", error);
        return res.status(500).json({ success: false, message: "User registration failed" });
    }
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
    const cookieOptions = {
        sameSite: 'None',
        secure: true,
        httpOnly: true,
    };
    res.cookie("token", token, { sameSite: "None", secure: true });
    res.json({ success: true, message: 'Login successfully' })
});



//User profile
export const userProfile = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const userData = await User.findOne({ email: user.email }).select("-password")
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