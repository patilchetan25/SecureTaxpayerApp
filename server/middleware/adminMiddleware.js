// middlewares/adminMiddleware.js
const jwt = require('jsonwebtoken');

const adminMiddleware = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        // Check if the user has administrator permissions
        if (!user.isAdmin) {
            return res.status(403).json({ error: 'Access denied, admin only' });
        }

        req.user = user; // Save user information for use in the controller
        next();
    });
};

module.exports = adminMiddleware;
