import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';
import crypto from 'crypto';

// Generate random password
const generateRandomPassword = () => {
    return crypto.randomBytes(8).toString('hex'); // 16 characters
};

// @desc    Webhook from Salla platform - Create user account
// @route   POST /api/webhook/salla/order
// @access  Public (but should be verified with webhook secret)
export const sallaOrderWebhook = async (req, res) => {
    try {
        console.log('📥 Received Salla Webhook:', JSON.stringify(req.body, null, 2));

        // Parse Salla Payload Structure
        const { event, data } = req.body;

        // Allow order.created and order.updated events
        if (event !== 'order.created' && event !== 'order.updated') {
            console.log(`ℹ️ Ignoring event: ${event}`);
            return res.status(200).json({ message: 'Event ignored' });
        }

        // Check Order Status
        const status = data.status?.slug;
        console.log(`📊 Order Status: ${status}`);

        // List of statuses that indicate payment is successful/order is confirmed
        const paidStatuses = ['completed', 'under_process', 'shipping_ready', 'shipped', 'delivered', 'shipping_progress'];

        // If status is payment_pending, canceled, or not in the paid list, skip account creation
        if (!paidStatuses.includes(status)) {
            console.log(`⏳ Order status is '${status}'. Skipping account creation.`);
            return res.status(200).json({
                success: true,
                message: `Order status is ${status}. Account creation skipped.`
            });
        }

        // Extract required fields from the nested structure
        const customer = data?.customer;
        const email = customer?.email;
        const first_name = customer?.first_name || '';
        const last_name = customer?.last_name || '';
        const full_name = `${first_name} ${last_name}`.trim();

        // Validation
        if (!email) {
            console.error('❌ Email missing in payload');
            return res.status(400).json({
                success: false,
                message: 'Email is required in customer data'
            });
        }

        console.log(`📦 Processing paid order for: ${email}`);

        // Check if user already exists
        const existingUser = await query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            console.log(`✅ User already exists: ${email}`);
            return res.status(200).json({
                success: true,
                message: 'User already exists',
                user_id: existingUser.rows[0].id
            });
        }

        // Set password to be the same as email
        const defaultPassword = email;
        console.log(`🔑 Generated password for ${email}: ${defaultPassword}`);

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(defaultPassword, salt);

        // Create user with password_changed = true (So they can login directly, or false to force change? Using false as per previous logic)
        // Note: Previous logic used false. Keeping it false.
        const result = await query(
            `INSERT INTO users (email, password_hash, full_name, password_changed) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, full_name, password_changed, created_at`,
            [email, password_hash, full_name || null, false]
        );

        const user = result.rows[0];

        // Create user profile
        await query(
            `INSERT INTO user_profiles (user_id, current_level, current_day) 
       VALUES ($1, $2, $3)`,
            [user.id, 'A1', 1]
        );

        console.log(`✅ User created successfully: ${email}`);

        res.status(201).json({
            success: true,
            message: 'User account created successfully',
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name
            }
        });

    } catch (error) {
        console.error('Salla webhook error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during user creation'
        });
    }
};

// @desc    Verify Salla webhook signature (optional but recommended)
// @middleware
export const verifySallaWebhook = (req, res, next) => {
    // TODO: Implement signature verification
    // const signature = req.headers['x-salla-signature'];
    // const secret = process.env.SALLA_WEBHOOK_SECRET;

    // For now, just pass through
    next();
};
