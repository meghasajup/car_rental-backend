import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    cars: [
        {
            carId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Car',
                required: true,
            },
            addedAt: {
                type: Date,
                default: Date.now,
            }
        }
    ],
}, {
    timestamps: true,
});

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);

