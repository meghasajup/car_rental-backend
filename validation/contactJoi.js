import Joi from 'joi';

export const contactValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        message: Joi.string().min(10).required(),
    });

    return schema.validate(data);
};
