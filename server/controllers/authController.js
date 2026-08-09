import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';

// Random password generator helper (e.g. Gold#8f2a)
const generateTempPassword = () => {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let rand = "";
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `Gold#${rand}`;
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Exact Admin credentials match: admin@gmail.com / Admin@123
    if (email === "admin@gmail.com" && password === "Admin@123") {
      return res.json({
        id: "admin-001",
        name: "System Administrator",
        email: "admin@gmail.com",
        role: "admin",
        mustChangePassword: false,
        token: "jwt-admin-token-aureate"
      });
    }

    // Exact Customer credentials match: user@gmail.com / User@123
    if (email === "user@gmail.com" && password === "User@123") {
      return res.json({
        id: "usr-001",
        name: "Valued Customer",
        email: "user@gmail.com",
        role: "user",
        mustChangePassword: false,
        token: "jwt-user-token-aureate"
      });
    }

    // Database lookup
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email. Please register." });
    }

    // Password validation
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
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

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists with this email address" });
    }

    const isEmailAdmin = email.includes("admin");
    user = await User.create({
      name,
      email,
      password,
      role: isEmailAdmin ? "admin" : "user",
      mustChangePassword: false
    });

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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email address is required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: "No registered account found with this email address." });
    }

    // Generate random temporary password
    const tempPassword = generateTempPassword();
    user.password = tempPassword;
    user.mustChangePassword = true;
    await user.save();

    console.log(`Generated temporary password for ${user.email}: ${tempPassword}`);

    // Send email with temporary password
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #FAF9F5; padding: 25px; color: #1e293b;">
        <div style="max-width: 550px; margin: 0 auto; background: #ffffff; border: 2px solid #D4AF37; padding: 30px; border-radius: 16px; box-shadow: 0 10px 25px rgba(212,175,55,0.15);">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #D4AF37; font-family: serif; margin: 0;">Aureate Luxe</h1>
            <p style="font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">1-Gram & 22K Real Gold Jewellery</p>
          </div>
          <h2 style="color: #0f172a; font-size: 18px; text-align: center;">Your Temporary Password Request</h2>
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

    await sendEmail({
      to: user.email,
      subject: `🔑 Your Temporary Password - Aureate Luxe`,
      html: emailHtml
    });

    res.json({ 
      message: `Temporary password has been sent to ${user.email}. Please check your email inbox!`,
      tempPassword 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword || newPassword.length < 4) {
      return res.status(400).json({ message: "Password must be at least 4 characters long." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: "User account not found." });
    }

    user.password = newPassword;
    user.mustChangePassword = false;
    await user.save();

    console.log(`Successfully updated password for ${user.email}. mustChangePassword set to false.`);

    res.json({ 
      message: "Password updated successfully!",
      mustChangePassword: false 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
