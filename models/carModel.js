import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  image: {
    type: [String],
    required: true,
    default: [""], // Cloudinary image
  },
  pricePerDay: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  transmission: {
    type: String,
    required: true,
    enum: ['Automatic', 'Manual'],
  },
  fuelType: {
    type: String,
    required: true,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
  },
  mileage: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  category: {
    type: String, // Example: 'Hatchback', 'SUV'
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  deleted: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});
export const Car = mongoose.model("Car", carSchema);