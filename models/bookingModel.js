import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    startDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    returnDate: { type: Date, required: true },
    returnTime: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    licenceNumber: { type: String, required: true }
}, {
    timestamps: true,
});

export const Booking = mongoose.model("Booking", bookingSchema);
