
import express from "express";
import {
  AdminCreate, adminCreateCar, adminDeleteCar, adminGetCarReviewById, adminGetCarReviews,
  adminLogin, AdminLogout, checkAdmin,
  adminUpdateCar, delteUser, updateUser,
  BookingDelete, bookingupdate, getAllBookings,
  getAllCars, getAllCarsById, getAllUserById, getAllUsers, getBookingId,
  adminUpdateCarReview,
  adminDeleteCarReview,
  AdminUserCreate,
  getReviewByCarId,
  getAllDetails
} from "../../controllers/adminController.js";

import verifyAdminToken from '../../middlewares/authAdmin.js';
const router = express.Router();



// Admin creation route
router.post("/create", AdminCreate);
router.post("/login", adminLogin);
router.use("/", verifyAdminToken)
router.post("/logout", AdminLogout)

router.get("/getalldetails",verifyAdminToken, getAllDetails)

router.get("/check-admin", checkAdmin)


// User Management Routes
router.post("/createuserByAd", AdminUserCreate)
router.get("/users", getAllUsers)
router.get("/userById/:id", getAllUserById)
router.put("/userUpdate/:id", updateUser)
router.delete("/userByDelete/:id", delteUser)


// Car Management Routes
router.post("/create", verifyAdminToken, adminCreateCar)
router.get("/cars", getAllCars);
router.get('/carsById/:id', getAllCarsById)
router.put('/carUpdate/:id', adminUpdateCar)
router.delete("/carDelete/:id", adminDeleteCar)

// Booking Management Routes
router.get("/bookings", getAllBookings);
router.get("/bookingsById/:id", getBookingId);
router.put("/bookingUpdate/:id", bookingupdate);
router.delete("/deleteBooking/:id", BookingDelete);

// Review Management Routes
router.get("/reviews", adminGetCarReviews)
router.get("/reviewById/:id", adminGetCarReviewById)
router.get("/getbycarid/:car", getReviewByCarId)
router.put("/updateReview/:id", adminUpdateCarReview)
router.delete("/deleteReview/:id", adminDeleteCarReview)



export default router;