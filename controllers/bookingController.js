import { Booking } from '../models/bookingModel.js';
import { Car } from '../models/carModel.js';
import { User } from '../models/userModel.js';

// Create
export const createBooking = async (req, res) => {
    const { user, car, startDate, startTime, returnDate, returnTime, totalPrice, pickupLocation, dropoffLocation, licenceNumber, paymentStatus } = req.body;

    try {
        // Check the car and user exist or not
        const foundCar = await Car.findById(car);
        const foundUser = await User.findById(user);

        if (!foundCar || !foundUser) {
            return res.status(404).json({ success: false, message: "Car or User not found" });
        }

        const booking = new Booking({
            user,
            car,
            startDate,
            startTime,
            returnDate,
            returnTime,
            totalPrice,
            pickupLocation,
            dropoffLocation,
            licenceNumber,
            paymentStatus,
        });

        await booking.save();

        res.status(201).json({ success: true, message: "Booking created successfully", data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};




// Get all 
export const getBooking = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user car', '-password');
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};




// Get 
export const getBookingById = async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await Booking.findById(id).populate('user car', '-password');

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};




// Update
export const updateBooking = async (req, res) => {
    const { id } = req.params;
    console.log("Booking ID:", id); // Debugging log

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        }).populate('user car', '-password');

        if (!updatedBooking) {
            console.log("Booking not found for ID:", id); // Debugging log
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.status(200).json({ success: true, message: "Booking updated successfully", data: updatedBooking });
    } catch (error) {
        console.error("Error updating booking:", error.message); // Debugging log
        res.status(500).json({ success: false, message: error.message });
    }
};





// Delete
export const deleteBooking = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBooking = await Booking.findByIdAndDelete(id);

        if (!deletedBooking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.status(200).json({ success: true, message: "Booking deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};