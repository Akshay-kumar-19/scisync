const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { sendPasswordResetEmail } = require("../services/emailService");

const JWT_SECRET = process.env.JWT_SECRET || "DEV_SECRET_CHANGE_ME";
const APP_BASE_URL = process.env.APP_BASE_URL || "http://127.0.0.1:5500/frontend/html";

function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
}

function signToken(user) {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role, fullName: user.fullName },
        JWT_SECRET,
        { expiresIn: "1d" }
    );
}

exports.register = async (req, res) => {
    try {
        const fullName = String(req.body.fullName || "").trim();
        const email = normalizeEmail(req.body.email);
        const password = String(req.body.password || "");

        if (!fullName || !email || !password) {
            return res.status(400).json({ success: false, message: "Full name, email, and password are required" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(409).json({ success: false, message: "Email already registered" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ fullName, email, password: hashed });
        const token = signToken(user);

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            token,
            user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.login = async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        const password = String(req.body.password || "");

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = signToken(user);
        res.json({
            success: true,
            message: "Login successful",
            token,
            user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("_id fullName email role");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: true, message: "If the account exists, a reset link has been sent" });
        }

        const rawToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
        user.resetPasswordTokenHash = tokenHash;
        user.resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();

        const resetLink = `${APP_BASE_URL}/login.html?mode=reset&email=${encodeURIComponent(user.email)}&token=${rawToken}`;
        const emailResult = await sendPasswordResetEmail({
            toEmail: user.email,
            fullName: user.fullName,
            resetLink
        });

        res.json({
            success: true,
            message: "If the account exists, a reset link has been sent",
            previewResetLink: emailResult.delivery === "preview" ? emailResult.resetLink : undefined
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        const token = String(req.body.token || "");
        const password = String(req.body.password || "");

        if (!email || !token || !password) {
            return res.status(400).json({ success: false, message: "Email, token, and new password are required" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            email,
            resetPasswordTokenHash: tokenHash,
            resetPasswordExpiresAt: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Reset link is invalid or expired" });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordTokenHash = null;
        user.resetPasswordExpiresAt = null;
        await user.save();

        res.json({ success: true, message: "Password reset successful. You can log in now." });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
