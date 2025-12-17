import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';
import { sendTokenResponse } from '../middleware/auth.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { email, password, full_name } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check if user exists
        const userExists = await query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Create user
        const result = await query(
            `INSERT INTO users (email, password_hash, full_name, password_changed) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, full_name, password_changed, created_at`,
            [email, password_hash, full_name || null, true] // true because they set their own password
        );

        const user = result.rows[0];

        // Create user profile
        await query(
            `INSERT INTO user_profiles (user_id, current_level, current_day) 
       VALUES ($1, $2, $3)`,
            [user.id, 'A1', 1]
        );

        // Send token response
        sendTokenResponse(user, 201, res);

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

// @desc    Register user (Secret Admin Route)
// @route   POST /api/auth/register-secret
// @access  Public (Secret)
export const registerSecret = async (req, res) => {
    try {
        const { email } = req.body;

        // Validation
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user exists
        const userExists = await query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Generate random password (8 chars)
        const password = Math.random().toString(36).slice(-8);

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Create user
        const result = await query(
            `INSERT INTO users (email, password_hash, full_name, password_changed) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, full_name, password_changed, created_at`,
            [email, password_hash, 'New User', false] // false forces password change
        );

        const user = result.rows[0];

        // Create user profile
        await query(
            `INSERT INTO user_profiles (user_id, current_level, current_day) 
       VALUES ($1, $2, $3)`,
            [user.id, 'A1', 1]
        );

        // Return the PLAIN TEXT password so admin can see it
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                ...user,
                generatedPassword: password
            }
        });

    } catch (error) {
        console.error('Secret register error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check for user
        const result = await query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = result.rows[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        await query(
            'UPDATE users SET last_login_at = NOW() WHERE id = $1',
            [user.id]
        );

        // Send token response with password_changed status
        sendTokenResponse(user, 200, res);

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const result = await query(
            `SELECT u.id, u.email, u.full_name, u.password_changed, u.terms_accepted, u.terms_accepted_at, u.created_at, u.last_login_at,
              up.current_level, up.current_day, up.listening_score, 
              up.reading_score, up.speaking_score, up.grammar_score,
              up.streak_days, up.total_study_minutes
       FROM users u
       LEFT JOIN user_profiles up ON u.id = up.user_id
       WHERE u.id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: result.rows[0]
        });

    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

// @desc    Change password (first time or update)
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Get user
        const result = await query(
            'SELECT * FROM users WHERE id = $1',
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = result.rows[0];

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        // Update password and set password_changed to true
        await query(
            `UPDATE users 
       SET password_hash = $1, password_changed = $2, updated_at = NOW() 
       WHERE id = $3`,
            [newPasswordHash, true, req.user.id]
        );

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during password change'
        });
    }
};

// @desc    Accept Terms and Conditions
// @route   PUT /api/auth/accept-terms
// @access  Private
export const acceptTerms = async (req, res) => {
    try {
        await query(
            'UPDATE users SET terms_accepted = $1, terms_accepted_at = NOW(), updated_at = NOW() WHERE id = $2',
            [true, req.user.id]
        );

        res.status(200).json({
            success: true,
            message: 'Terms accepted successfully'
        });

    } catch (error) {
        console.error('Accept terms error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during terms acceptance'
        });
    }
};
