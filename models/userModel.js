import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true, // Only if you're using a unique username
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    profileImage: {
        type: String,
        default: '',  // Default value, can be updated when an image is uploaded
    },
}, {
    timestamps: true,
});

export const User = mongoose.model("User", userSchema);