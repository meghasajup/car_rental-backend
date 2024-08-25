import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return this.endDate ? value < this.endDate : true;
            },
            message: "Start date must be before end date",
        },
    },
    startTime: {
        type: String,
        required: true,
    },
    returnDate: {
        type: Date,
        required: true,
    },
    returnTime: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending',
    },
    pickupLocation: {
        type: String,
        required: true,
    },
    dropoffLocation: {
        type: String,
        required: true,
    },
    licenceNumber: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Pending', 'Failed'],
        default: 'Pending',
    },
}, {
    timestamps: true,
});

export const Booking = mongoose.model("Booking", bookingSchema);