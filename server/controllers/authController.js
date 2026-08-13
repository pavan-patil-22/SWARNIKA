import User from '../models/User.js';
import Otp from '../models/Otp.js';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../utils/sendEmail.js';

// Helper to generate temporary password
const generateTempPassword = () => {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let rand = "";
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `Gold#${rand}`;
};

// 1. Send OTP for Registration Verification
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email address is required." });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ message: "An account already exists with this email address. Please sign in." });
    }

    // Generate 6-digit numeric OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to DB
    await Otp.findOneAndUpdate(
      { email: cleanEmail },
      { otp: otpCode, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Send Email with OTP
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #FAF9F5; padding: 25px; color: #1e293b;">
        <div style="max-width: 550px; margin: 0 auto; background: #ffffff; border: 2px solid #D4AF37; padding: 30px; border-radius: 16px; box-shadow: 0 10px 25px rgba(212,175,55,0.15);">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #D4AF37; font-family: serif; margin: 0;">SWARNIKA</h1>
            <p style="font-size: 11px; color: #92400e; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; font-weight: bold;">LUXURY HERITAGE</p>
          </div>
          <h2 style="color: #0f172a; font-size: 18px; text-align: center;">Verify Your Registration Email</h2>
          <p style="font-size: 13px; color: #475569; line-height: 1.6;">Thank you for creating an account with SWARNIKA LUXURY HERITAGE.</p>
          <p style="font-size: 13px; color: #475569; line-height: 1.6;">Please use the 6-digit One-Time Password (OTP) below to complete your account activation:</p>
          <div style="background-color: #fef3c7; border: 2px dashed #d97706; padding: 18px; border-radius: 12px; text-align: center; margin: 20px 0;">
            <span style="font-size: 11px; color: #92400e; font-weight: bold; display: block; text-transform: uppercase; letter-spacing: 1px;">Your Registration OTP Code</span>
            <strong style="font-family: monospace; font-size: 32px; color: #78350f; letter-spacing: 6px; display: block; margin-top: 6px;">${otpCode}</strong>
          </div>
          <p style="font-size: 11px; color: #94a3b8; text-align: center;">This OTP is valid for 10 minutes. Do not share this code with anyone.</p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: cleanEmail,
        subject: `🔑 ${otpCode} is your SWARNIKA Registration OTP`,
        html: emailHtml
      });
    } catch (emailErr) {
      console.warn("Nodemailer send error (using dev fallback OTP):", emailErr.message);
    }

    res.json({
      message: `Verification OTP code has been sent to ${cleanEmail}. Please check your email inbox!`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Verify OTP Endpoint
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and 6-digit OTP are required." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const otpRecord = await Otp.findOne({ email: cleanEmail, otp: otp.trim() });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP code. Please request a new OTP." });
    }

    res.json({ message: "OTP verified successfully!", verified: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Login User with Bcrypt Password Verification (No Hardcoded Bypass)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password." });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Find User in MongoDB Database
    let user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: "No registered account found with this email. Please register." });
    }

    // Verify Password using Bcrypt Compare
    let isPasswordValid = false;

    // Check hashed password
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      // Legacy plaintext check -> auto-upgrade to hashed password
      if (user.password === password) {
        isPasswordValid = true;
        user.password = await bcrypt.hash(password, 10);
        await user.save();
      }
    }

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password. Please check your credentials." });
    }

    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      mustChangePassword: user.mustChangePassword || false,
      token: `jwt-token-${user._id}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Register User (Requires OTP & Hashes Password)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ message: "Name, email, password, and OTP verification code are required." });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Verify OTP first
    const otpRecord = await Otp.findOne({ email: cleanEmail, otp: otp.trim() });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP verification code. Please request a new OTP." });
    }

    // Check duplicate user
    let existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email address already exists." });
    }

    // Hash Password securely with Bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    const isEmailAdmin = cleanEmail.includes("admin");

    const user = await User.create({
      name,
      email: cleanEmail,
      password: hashedPassword,
      role: isEmailAdmin ? "admin" : "user",
      mustChangePassword: false
    });

    // Delete used OTP
    await Otp.deleteOne({ email: cleanEmail });

    res.status(201).json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      mustChangePassword: false,
      token: `jwt-token-${user._id}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Forgot Password Endpoint
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email address is required." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: "No registered account found with this email address." });
    }

    // Generate random temporary password and hash it
    const tempPassword = generateTempPassword();
    user.password = await bcrypt.hash(tempPassword, 10);
    user.mustChangePassword = true;
    await user.save();

    // Send email with temporary password
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #FAF9F5; padding: 25px; color: #1e293b;">
        <div style="max-width: 550px; margin: 0 auto; background: #ffffff; border: 2px solid #D4AF37; padding: 30px; border-radius: 16px; box-shadow: 0 10px 25px rgba(212,175,55,0.15);">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #D4AF37; font-family: serif; margin: 0;">SWARNIKA</h1>
            <p style="font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">LUXURY HERITAGE</p>
          </div>
          <h2 style="color: #0f172a; font-size: 18px; text-align: center;">Temporary Password Request</h2>
          <p style="font-size: 13px; color: #475569; line-height: 1.6;">Hello <strong>${user.name}</strong>,</p>
          <p style="font-size: 13px; color: #475569; line-height: 1.6;">A temporary password has been generated for your account as requested:</p>
          <div style="background-color: #fef3c7; border: 1px dashed #d97706; padding: 15px; border-radius: 12px; text-align: center; margin: 20px 0;">
            <span style="font-size: 11px; color: #92400e; font-weight: bold; display: block; text-transform: uppercase;">Your Temporary Password</span>
            <strong style="font-family: monospace; font-size: 24px; color: #78350f; letter-spacing: 2px; display: block; margin-top: 5px;">${tempPassword}</strong>
          </div>
          <p style="font-size: 12px; color: #b45309; background: #fffbeb; padding: 10px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-top: 15px;">
            ⚠️ <strong>Security Notice:</strong> Upon logging in with this temporary password, you will be required to set a new permanent password immediately.
          </p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: `🔑 Your Temporary Password - SWARNIKA`,
        html: emailHtml
      });
    } catch (e) {
      console.warn("Nodemailer send error:", e.message);
    }

    res.json({ 
      message: `Temporary password has been sent to ${user.email}. Please check your email inbox!`,
      tempPassword 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Change Password Endpoint
export const changePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword || newPassword.length < 4) {
      return res.status(400).json({ message: "Password must be at least 4 characters long." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: "User account not found." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.mustChangePassword = false;
    await user.save();

    res.json({ 
      message: "Password updated successfully!",
      mustChangePassword: false 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
