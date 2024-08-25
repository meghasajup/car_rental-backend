import Joi from 'joi';

export const bookingSchema = Joi.object({
    user:
        Joi.string().length(25).hex().required(),
    car:
        Joi.string().length(25).hex().required(),
    startDate:
        Joi.date().required(),
    startTime:
        Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
    returnDate:
        Joi.date().required(),
    returnTime:
        Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
    totalPrice:
        Joi.number().positive().required(),
    status:
        Joi.string().valid('Pending', 'Confirmed', 'Cancelled', 'Completed').default('Pending'),
    pickupLocation:
        Joi.string().required(),
    dropoffLocation:
        Joi.string().required(),
    paymentStatus:
        Joi.string().valid('Paid', 'Pending', 'Failed').default('Pending')
}).custom((value, helpers) => {
    if (new Date(value.startDate).getTime() > new Date(value.endDate).getTime()) {
        return helpers.message('Start date must be before end date');
    }
    return value;
}, 'Custom validation');

export default bookingSchema;