const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign(
        {
            userId: user._id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '7d',
        }
    );
};

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase(), isActive: true });

    if (!user) {
        return res.status(401).json({ message: 'بيانات تسجيل الدخول غير صحيحة' });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        return res.status(401).json({ message: 'بيانات تسجيل الدخول غير صحيحة' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
        success: true,
        token,
        user: {
            id: user._id,
            email: user.email,
            role: user.role,
        },
    });
});

// GET /api/auth/verify
// Verify token and return user info
exports.verify = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId);

    if (!user || !user.isActive) {
        return res.status(401).json({ message: 'المستخدم غير موجود أو غير نشط' });
    }

    res.json({
        success: true,
        user: {
            id: user._id,
            email: user.email,
            role: user.role,
        },
    });
});

// POST /api/auth/logout (optional - mainly for frontend to clear token)
exports.logout = asyncHandler(async (req, res) => {
    res.json({
        success: true,
        message: 'تم تسجيل الخروج بنجاح',
    });
});
