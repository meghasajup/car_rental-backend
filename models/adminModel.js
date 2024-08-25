import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    adminName: {
        type: String,
        required: true,
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
    profileImage: {
        type: String,
        default: '',  // Default value, can be updated when an image is uploaded
    },
}, {
    timestamps: true,
});

export const Admin = mongoose.model("Admin", adminSchema);