import Joi from 'joi';

// Registration
export const validateUserRegistration = (data) => {
    const schema = Joi.object({
        name:
            Joi.string().min(3).max(30).required(),
        email:
            Joi.string().email().required(),
        password:
            Joi.string().min(6).required(),
        confirmPassword:
            Joi.any().valid(Joi.ref('password')).required().messages({
                'any.only': 'Passwords do not match',
            }),
        phone:
            Joi.string().pattern(/^[0-9]{10}$/).required(),
            profileImage: Joi.string().optional(),
    });
    return schema.validate(data);
};


//User login
export const validateUserLogin = (data) => {
    const schema = Joi.object({
        email:
            Joi.string().email().required(),
        password:
            Joi.string().min(6).required(),
    });
    return schema.validate(data);
};