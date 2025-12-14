import jwt from 'jsonwebtoken';

// Middleware to verify JWT token from httpOnly cookie
export const protect = async (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no token'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Add user info to request
            req.user = {
                id: decoded.id,
                email: decoded.email
            };

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error in auth middleware'
        });
    }
};

// Generate JWT token and set httpOnly cookie
export const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Cookie options
    const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true, // Cannot be accessed by JavaScript
        secure: true, // Always secure for cross-site
        sameSite: 'none' // Required for cross-site cookies (Netlify -> Railway)
    };

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                password_changed: user.password_changed || false
            }
        });
};
