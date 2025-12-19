import jwt from 'jsonwebtoken';

// Middleware to verify JWT token from httpOnly cookie or Authorization header
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in cookies
        if (req.cookies.token) {
            token = req.cookies.token;
        }
        // Check for token in Authorization header
        else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

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
    const isProduction = process.env.NODE_ENV === 'production';

    // In development (localhost), we cannot use Secure: true (unless using https locally)
    // and SameSite: 'none' requires Secure: true.
    // So for dev: Secure: false, SameSite: 'lax' (default)
    // For prod: Secure: true, SameSite: 'none' (for cross-site if backend/frontend separated like Railway/Netlify)

    const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true, // Cannot be accessed by JavaScript
        secure: isProduction, // True in prod, False in dev
        sameSite: isProduction ? 'none' : 'lax' // None in prod (cross-origin), Lax in dev
    };

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token, // Send token in body for mobile/Safari support
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                password_changed: user.password_changed || false
            }
        });
};
