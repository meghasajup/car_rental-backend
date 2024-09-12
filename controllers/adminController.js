import { Admin } from "../models/adminModel.js";
import { Booking } from "../models/bookingModel.js";
import { Car } from "../models/carModel.js";
import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt';
import { generateAdminToken } from "../utils/generateToken.js";
import { validateUserRegistration } from "../validation/userJoi.js";
import { Review } from "../models/reviewModel.js";
import { asyncHandler } from '../utils/asyncHandler.js';
import { adminCreate, adminLoginSchema } from "../validation/adminJoi.js";
import { createCarsValidation } from "../validation/carJoi.js";
import bookingSchema from "../validation/bookingJoi.js";


//Admin create
export const AdminCreate = asyncHandler(async (req, res, next) => {
    // Validate the request body using Joi
    const { error } = adminCreate.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { adminName, email, password } = req.body;

    const adminExist = await Admin.findOne({ email });
    if (adminExist) {
        return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const newAdmin = new Admin({ adminName, email, password: hashedPassword });
    await newAdmin.save();

    const adminToken = generateAdminToken(email, "admin");

    // Set token in cookie
    res.cookie("admintoken", adminToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.json({ success: true, message: "Admin created successfully" });
});



//Admin login
export const adminLogin = asyncHandler(async (req, res, next) => {
    // Validate the request body using Joi
    // console.log("requestData:", req.headers)
    const { error } = adminLoginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { email, password } = req.body;

    // Find the admin by email
    const adminExist = await Admin.findOne({ email });
    if (!adminExist) {
        return res.status(404).json({ success: false, message: "Admin does not exist" });
    }

    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, adminExist.password);
    if (!isMatch) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate token
    const token = generateAdminToken(email, "admin");

    // Set token in cookie
    res.cookie("admintoken", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ success: true, message: "Admin login successfully", loginToken: token});
});




//Check admin
export const checkAdmin = asyncHandler(async (req, res, next) => {
    const admin = req.admin;
    if (!admin) {
        return res.status(401).json({ success: false, message: 'user not authenticated' })
    }
    res.json({ success: true, message: 'Admin is authenticated' })
})

//getAllDetails
export const getAllDetails = asyncHandler(async (req, res, next) => {
    try {
        if (!req.admin) {
            return res.status(403).json({ message: 'Access denied. Admin details not found.' });
        }

        const { email } = req.admin; // Use req.admin instead of req.user
        const admin = await Admin.findOne({ email }).populate('car');

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.json({
            data: admin,
        });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
});



//Admin logout
export const AdminLogout = asyncHandler(async (req, res, next) => {
    res.clearCookie("admintoken")
    res.json({ success: true, message: 'Admin logged out successfully' })
})



// User Management Routes

//Admin user create
export const AdminUserCreate = asyncHandler(async (req, res, next) => {
    //validation fro joi
    const { error } = await validateUserRegistration(req.body);
    if (error) {
        return res.status(402).json({ success: false, message: error.details[0].message });
    }

    const { name, email, password, phone, username } = req.body;

    const userExit = await User.findOne({ email })
    if (userExit) {
        return res.status(400).json({ success: false, message: 'user already exist' })
    }

    //hasing
    const salt = 10
    const hashedPassword = bcrypt.hashSync(password, salt)


    const newUser = new User({ name, email, password: hashedPassword, phone, username })
    await newUser.save()


    //token
    const adminToken = generateAdminToken(email, "admin");
    // const token=generateUserToken(email)
    // res.cookie("admintoken", adminToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.cookie('admintoken', adminToken)

    res.json({ success: true, message: "user created By admin is successfully" });
})


//get all users
export const getAllUsers = asyncHandler(async (req, res, next) => {

    const users = await User.find().select('-password'); // Exclude passwords
    res.json({ success: true, message: 'Users list fetched successfully', data: users });
})


//get all user by id
export const getAllUserById = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    const car = await User.findById(id).select('-password');
    // const users = await User.find() // Exclude passwords
    res.json({ success: true, message: 'Users list fetched successfully', data: car });
})

//update user
export const updateUser = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    const { name, email, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, { name, email, phone }, { new: true });
    if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User updated successfully', data: updatedUser });
})

//delete user
export const delteUser = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    const { name, email, phone } = req.body;

    const deletedUser = await User.findByIdAndDelete(id)
    if (!deletedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully', data: deletedUser });
})

// Car Management Routes

//admin create car
export const adminCreateCar = asyncHandler(async (req, res, next) => {

    // Validate request body
    const { error } = createCarsValidation(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const { brand, model, year, pricePerDay, capacity, transmission, fuelType, mileage, color, registrationNumber, availability } = req.body;

    if (!req.file) {
        return res.status(400).json({ success: false, message: "Please upload an image" });
    }

    const existingCar = await Car.findOne({ model: model });
    if (existingCar) {
        return res.status(400).json({ success: false, message: "Car already exists" });
    }

    // Upload an image
    const uploadResult = await cloudinaryInstance.uploader.upload(req.file.path, { folder: "car" });

    const newCar = new Car({ brand, model, year, pricePerDay, capacity, transmission, fuelType, mileage, color, registrationNumber, availability });
    if (uploadResult?.url) {
        newCar.image = uploadResult.url;
    }

    await newCar.save();
    res.json({ success: true, message: 'New car created successfully!', data: newCar });
})

//admin get all cars
export const getAllCars = asyncHandler(async (req, res, next) => {

    const cars = await Car.find();
    res.json({ success: true, message: 'Cars list fetched successfully', data: cars });
})

//get all car by id
export const getAllCarsById = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    const car = await Car.findById(id);
    if (!car) {
        return res.status(404).json({ success: false, message: 'Car not found' });
    }
    res.json({ success: true, message: 'Car fetched successfully', data: car });
})

//update car by id
export const adminUpdateCar = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    const { brand, model, year, pricePerDay, capacity, transmission, fuelType, mileage, color, registrationNumber, availability } = req.body;
    const updatedCar = await Car.findByIdAndUpdate(id, {
        brand, model, year, pricePerDay, capacity, transmission, fuelType, mileage, color, registrationNumber, availability
    }, { new: true });
    if (!updatedCar) {
        return res.status(404).json({ success: false, message: 'Car not found' });
    }
    res.json({ success: true, message: 'Car updated successfully', data: updatedCar });
})

//admin delete car
export const adminDeleteCar = asyncHandler(async (req, res, next) => {

    const { id } = req.params;

    const deletedCar = await Car.findByIdAndDelete(id);
    if (!deletedCar) {
        return res.status(404).json({ success: false, message: 'Car not found' });
    }

    res.json({ success: true, message: 'Car deleted successfully', data: deletedCar });
})


// Booking Management Routes

//get all bookings
export const getAllBookings = asyncHandler(async (req, res, next) => {

    const bookings = await Booking.find().populate('user').populate('car');
    res.json({ success: true, message: 'Bookings list fetched successfully', data: bookings });
})

//get booking by id
export const getBookingId = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    const booking = await Booking.findById(id).populate('user car');
    if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking fetched successfully', data: booking });
})

//update booking
export const bookingupdate = asyncHandler(async (req, res, next) => {
    console.log('Request body:', req.body); // Log request body
    console.log('Request params:', req.params); // Log request params

    const { error, value } = bookingSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { id } = req.params;

    const { user, car, startTime, startDate, returnDate, returnTime, totalPrice, pickupLocation, dropoffLocation } = req.body;
    const updatedBooking = await Booking.findByIdAndUpdate(id, {
        user, car, startTime, startDate, returnDate, returnTime, totalPrice, pickupLocation, dropoffLocation
    }, { new: true });
    if (!updatedBooking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking updated successfully', data: updatedBooking });
});


//delete booking
export const BookingDelete = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(id);
    if (!deletedBooking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking deleted successfully', data: deletedBooking });
})


// Review Management Routes

//get all reviews
export const adminGetCarReviews = asyncHandler(async (req, res) => {
    const reviewList = await Review.find();
    res.json({ success: true, message: 'Review list fetched', data: reviewList });
});


//get all reviews by id
export const adminGetCarReviewById = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    const reviewById = await Review.findById(id);

    if (!reviewById) {
        return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.json({ success: true, message: 'Review fetched successfully', data: reviewById });
})


//create review
export const adminUpdateCarReview = asyncHandler(async (req, res, next) => {

    const { userId, carId, rating, reviewText } = req.body;
    const { id } = req.params;

    const updatedCarReview = await Review.findByIdAndUpdate(id, { user: userId, car: carId, rating, reviewText }, { new: true });

    if (!updatedCarReview) {
        return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.json({ success: true, message: 'Review updated successfully!', data: updatedCarReview });
})

//delete review
export const adminDeleteCarReview = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    const deleteCarReview = await Review.findByIdAndDelete(id);

    if (!deleteCarReview) {
        return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.json({ success: true, message: 'Review deleted successfully!', data: deleteCarReview });
})

//get review by car id
export const getReviewByCarId = asyncHandler(async (req, res, next) => {

    const { car } = req.params;

    // Assuming carId is a field in the Review schema
    const reviews = await Review.find({ car });

    if (!reviews || reviews.length === 0) {
        return res.status(404).json({ success: false, message: 'No reviews found for this car' });
    }

    res.json({ success: true, message: 'Reviews fetched successfully', data: reviews });
});