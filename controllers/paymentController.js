import Stripe from 'stripe';
import { asyncHandler } from '../utils/asyncHandler.js';

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY);

export const MakePayment = asyncHandler(async (req, res, next) => {
    const { carDetails, amount } = req.body;

    // Ensure amount is in the smallest currency unit (e.g., paise for INR)
    const amountInPaise = amount * 100;

    const lineItems = [{
        price_data: {
            currency: 'inr',
            product_data: {
                name: `Car Booking ${carDetails.model}`,
                description: `Booking for car ID: ${carDetails.location}`,
            },
            unit_amount: amountInPaise,
        },
        quantity: 1,
    }];

    
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.VITE_CLIENT_DOMAIN}/user/payment-success`,
            cancel_url: `${process.env.VITE_CLIENT_DOMAIN}/user/payment-cancel`,
        });

        res.json({ success: true, sessionId: session.id });    
});
