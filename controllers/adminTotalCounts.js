import { User } from '../models/userModel.js';
import { Car } from '../models/carModel.js';
import { Booking } from '../models/bookingModel.js';
import { Review } from '../models/reviewModel.js';

// Get total number of users
export const getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments(); // Counts total users in the collection
    res.status(200).json({ total: totalUsers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching total users" });
  }
};

// Get total number of cars
export const getTotalCars = async (req, res) => {
  try {
    const totalCars = await Car.countDocuments(); // Counts total cars in the collection
    res.status(200).json({ total: totalCars });
  } catch (error) {
    res.status(500).json({ message: "Error fetching total cars" });
  }
};

// Get total number of bookings
export const getTotalBookings = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments(); // Counts total bookings in the collection
    res.status(200).json({ total: totalBookings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching total bookings" });
  }
};

// Get total number of reviews
export const getTotalReviews = async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments(); // Counts total reviews in the collection
    res.status(200).json({ total: totalReviews });
  } catch (error) {
    res.status(500).json({ message: "Error fetching total reviews" });
  }
};
