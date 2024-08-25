import { Car } from '../models/carModel.js';
import { createCarsValidation } from '../validation/carJoi.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { cloudinaryInstance } from '../config/cloudinaryConfig.js';
import mongoose from 'mongoose';

// Create
export const createCar = async (req, res) => {
    //Validate request body
    const { error } = createCarsValidation(req.body);
    if (error) {
        return res.status(400).send({ status: false, error: error.details[0].message });
    }

    let imageUrl = [];
    if (req.file) {
        try {
            const result = await cloudinaryInstance.uploader.upload(req.file.path, {
                folder: 'cars',
            });
            imageUrl.push(result.secure_url);
        } catch (error) {
            return res.status(500).send({ status: false, error: 'Image upload failed' });
        }
    }

    const newCar = new Car({
        ...req.body,
        image: imageUrl,
        admin: req.user._id
    });

    try {
        const savedCar = await newCar.save();
        res.status(201).send({ status: true, message: "Car created successfully", data: savedCar });
    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
};



// Get all cars
export const getCarList = async (req, res) => {
    try {
        const cars = await Car.find({ deleted: false }).populate('admin', 'name email');
        res.status(200).send({ status: true, data: cars });
    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
};




// Get 
export const getCarListById = async (req, res) => {
    try {
        const car = await Car.findOne({ _id: req.params.id, deleted: false }).populate('admin', 'name email');
        if (!car) {
            return res.status(404).send({ status: false, error: 'Car not found' });
        }
        res.status(200).send({ status: true, data: car });
    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
};



// Update 
export const updateCar = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({ status: false, error: 'Invalid car ID' });
    }

    const { error } = createCarsValidation(req.body);
    if (error) {
        return res.status(400).send({ status: false, error: error.details[0].message });
    }

    try {
        const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCar) {
            return res.status(404).send({ status: false, error: 'Car not found' });
        }
        res.status(200).send({ status: true, message: "Updated successfully", data: updatedCar });
    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
};




// Delete
export const deleteCar = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({ status: false, error: 'Invalid car ID' });
    }

    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).send({ status: false, error: 'Car not found' });
        }

        // Soft delete
        car.deleted = true;
        await car.save();

        res.status(200).send({ status: true, message: "Car deleted successfully", data: car });
    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
};



//Search
export const search = asyncHandler(async (req, res) => {
    const { model } = req.query; // Extracting the car model from query parameters

    if (!model) {
        return res.status(400).json({ success: false, message: 'Model query parameter is required' });
    }

    // Search for cars that match the provided model (case-insensitive, partial match)
    const cars = await Car.find({
        model: { $regex: model, $options: 'i' }, // 'i' makes it case-insensitive
        deleted: false // Only search for non-deleted cars
    });

    if (cars.length === 0) {
        return res.status(404).json({ success: false, message: 'No cars found' });
    }

    // Return the matching cars
    res.status(200).json({ success: true, message: 'Cars found successfully', data: cars });
});