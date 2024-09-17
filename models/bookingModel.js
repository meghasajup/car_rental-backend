import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true

  },
  startDate: {
    type: Date

  },
  startTime: {
    type: String

  },
  returnDate: {
    type: Date

  },
  returnTime: {
    type: String

  },
  totalCost: {
    type: Number,
    required: true

  },
  pickupLocation: {
    type: String,
    required: true

  },
  dropoffLocation: {
    type: String,
    required: true

  },
  licenceNumber: {
    type: String

  },
  pickupDateTime: {
    type: Date,
    required: true,
  },
  dropoffDateTime: {
    type: Date,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true,
});

export const Booking = mongoose.model("Booking", bookingSchema);
