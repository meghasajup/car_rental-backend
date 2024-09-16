import { Wishlist } from '../models/wishlistModel.js';

// Add a car to the wishlist
export const addToWishlist = async (req, res) => {
    const { carId } = req.body;
    const userId = req.user._id;

    try {
        const existingWishlist = await Wishlist.findOne({ user: userId, car: carId });

        if (existingWishlist) {
            return res.status(400).json({ success: false, message: "Car is already in wishlist" });
        }

        const wishlist = new Wishlist({
            user: userId,
            car: carId,
        });

        await wishlist.save();

        res.status(201).json({ success: true, message: "Car added to wishlist", wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding to wishlist", error: error.message });
    }
};

// Remove a car from the wishlist
export const removeFromWishlist = async (req, res) => {
    const { carId } = req.params;
    const userId = req.user._id;

    try {
        const wishlist = await Wishlist.findOneAndDelete({ user: userId, car: carId });

        if (!wishlist) {
            return res.status(404).json({ success: false, message: "Car not found in wishlist" });
        }

        res.status(200).json({ success: true, message: "Car removed from wishlist" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error removing from wishlist", error: error.message });
    }
};

// Get all wishlist items for a user
export const getUserWishlist = async (req, res) => {
    const userId = req.user._id;

    try {
        const wishlist = await Wishlist.find({ user: userId }).populate('car');

        res.status(200).json({ success: true, wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching wishlist", error: error.message });
    }
};
