import Contact from '../models/Contact.js';
import mongoose from 'mongoose';
import { sendEmail } from '../utils/sendEmail.js';

// Public endpoint: Submit Contact Us Inquiry
export const submitInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    const inquiry = new Contact({
      id: `inq-${Date.now()}`,
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message
    });

    await inquiry.save();
    console.log(`New Contact Inquiry created: ${inquiry.id} from ${inquiry.email}`);

    // Send automated acknowledgement email if configured
    sendEmail({
      to: inquiry.email,
      subject: `We received your inquiry - SWARNIKA LUXURY HERITAGE (${inquiry.id})`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #FAF9F5; padding: 25px; color: #1e293b;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #D4AF37; padding: 30px; border-radius: 16px;">
            <h2 style="color: #D4AF37; font-family: serif; text-align: center; margin-top: 0;">SWARNIKA LUXURY HERITAGE</h2>
            <h3 style="color: #0f172a;">Hello ${inquiry.name},</h3>
            <p style="font-size: 13px; color: #475569;">Thank you for reaching out to us! We have received your inquiry regarding <strong>"${inquiry.subject}"</strong>.</p>
            <div style="background: #FAF9F5; padding: 15px; border-left: 4px solid #D4AF37; border-radius: 8px; font-style: italic; margin: 15px 0;">
              "${inquiry.message}"
            </div>
            <p style="font-size: 13px; color: #475569;">Our customer service team will get back to you shortly via Email or WhatsApp.</p>
          </div>
        </div>
      `
    }).catch(e => console.error("Contact receipt email notice:", e.message));

    res.status(201).json({ success: true, inquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin endpoint: Fetch all contact inquiries
export const getInquiries = async (req, res) => {
  try {
    const inquiries = await Contact.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin endpoint: Reply via Email or WhatsApp
export const replyInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMethod, adminReply } = req.body;

    if (!adminReply || !adminReply.trim()) {
      return res.status(400).json({ message: "Reply message text is required" });
    }

    // Support lookup by string id OR MongoDB _id
    let inquiry = await Contact.findOne({ id });
    if (!inquiry && mongoose.Types.ObjectId.isValid(id)) {
      inquiry = await Contact.findById(id);
    }

    if (!inquiry) {
      return res.status(404).json({ message: "Contact inquiry not found" });
    }

    const isWhatsApp = replyMethod?.toUpperCase() === 'WHATSAPP';
    const status = isWhatsApp ? 'Replied_WhatsApp' : 'Replied_Email';

    inquiry.status = status;
    inquiry.adminReply = adminReply;
    inquiry.replyMethod = isWhatsApp ? 'WhatsApp' : 'Email';
    inquiry.repliedAt = new Date();

    await inquiry.save();

    let whatsappUrl = null;
    let emailDispatched = false;

    if (isWhatsApp) {
      // Build WhatsApp wa.me link
      let rawPhone = inquiry.phone || '';
      let cleanPhone = rawPhone.replace(/\D/g, ''); // strip non-digits
      if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
        cleanPhone = '91' + cleanPhone;
      }

      const encodedMessage = encodeURIComponent(
        `Hello ${inquiry.name},\n\nThank you for reaching out to SWARNIKA LUXURY HERITAGE regarding "${inquiry.subject}".\n\n*Official Response from SWARNIKA Support*:\n${adminReply}\n\nWarm regards,\nSWARNIKA LUXURY HERITAGE Team`
      );

      whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodedMessage}` : `https://wa.me/?text=${encodedMessage}`;
      console.log(`WhatsApp Reply URL generated for inquiry ${inquiry.id}: ${whatsappUrl}`);

    } else {
      // Dispatch Email via Nodemailer safely
      try {
        await sendEmail({
          to: inquiry.email,
          subject: `Re: ${inquiry.subject} - SWARNIKA LUXURY HERITAGE`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #FAF9F5; padding: 25px; color: #1e293b;">
              <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #D4AF37; padding: 30px; border-radius: 16px;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <h2 style="color: #D4AF37; font-family: serif; margin: 0;">SWARNIKA</h2>
                  <p style="font-size: 10px; color: #92400e; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">LUXURY HERITAGE</p>
                </div>
                <h3 style="color: #0f172a;">Dear ${inquiry.name},</h3>
                <p style="font-size: 13px; color: #475569;">Thank you for contacting us. Here is our official response to your inquiry regarding <strong>"${inquiry.subject}"</strong>:</p>
                <div style="background: #FAF9F5; padding: 18px; border-left: 4px solid #D4AF37; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0; white-space: pre-wrap; font-size: 14px; color: #0f172a;">${adminReply}</p>
                </div>
                <p style="font-size: 12px; color: #64748b; font-style: italic;">Original Inquiry Message: "${inquiry.message}"</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="font-size: 11px; color: #94a3b8; text-align: center;">SWARNIKA Support Team • 1 Gram & 22K Real Gold Jewellery</p>
              </div>
            </div>
          `
        });
        emailDispatched = true;
        console.log(`Email Reply dispatched for inquiry ${inquiry.id} to ${inquiry.email}`);
      } catch (emailErr) {
        console.warn("Nodemailer dispatch notice:", emailErr.message);
      }
    }

    res.json({
      success: true,
      inquiry,
      whatsappUrl,
      emailDispatched
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
