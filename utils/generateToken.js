import jwt from 'jsonwebtoken';

// Generate a user token
export const generateUserToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};

// Generate an admin token
export const generateAdminToken = (email, role) => {
    return jwt.sign({ email, role }, process.env.JWT_ADMIN_KEY, { expiresIn: '2h' });
};

// Generate a review token
export const generateReviewToken = (reviewId) => {
    return jwt.sign({ reviewId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};
