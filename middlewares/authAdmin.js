import jwt from 'jsonwebtoken';

const verifyAdminToken = (req, res, next) => {
    // Extract token from cookies or Authorization header
    // 

    // console.log("requestData:", req.headers, req.cookies)
    const token = req.cookies.admintoken || req.headers['authorization']?.replace(/^Bearer\s/, '');

    if (!token) {
        return res.status(403).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_ADMIN_KEY);

        // Check if the decoded token is for an admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Not an admin.' });
        }

        // Attach the admin details to the request object
        req.admin = decoded;

        // Proceed to the next middleware or controller
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};

export default verifyAdminToken;