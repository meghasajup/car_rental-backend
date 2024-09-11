import express from 'express'
import userRoute from './userRoute.js'
import carRoute from './carRoutes.js'
import bookingRoute from './bookingRoute.js'
import adminRoute from './adminRoutes.js'
import reviewRoute from './reviewRoute.js'
import wishlistRoute from './wishlistRoute.js'
import paymentRoute from './paymentRoute.js'

const v1Router = express.Router();

v1Router.use("/user", userRoute);
v1Router.use("/car", carRoute);
v1Router.use("/booking", bookingRoute);
v1Router.use("/admin", adminRoute);
v1Router.use("/review", reviewRoute);
v1Router.use("/wishlist", wishlistRoute);
v1Router.use("/payment", paymentRoute);


export default v1Router ;