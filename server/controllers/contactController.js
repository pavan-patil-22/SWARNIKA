import Contact from '../models/Contact.js';
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
      subject: `We received your inquiry - Aureate Luxe (${inquiry.id})`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #FAF9F5; padding: 20px; color: #111;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #D4AF37; padding: 30px; border-radius: 12px;">
            <h2 style="color: #D4AF37; font-family: serif; text-align: center;">Aureate Luxe 1-Gram Jewellery</h2>
            <h3>Hello ${inquiry.name},</h3>
            <p>Thank you for reaching out! We have received your inquiry regarding <strong>"${inquiry.subject}"</strong>.</p>
            <p style="background: #FAF9F5; padding: 12px; border-radius: 8px; font-style: italic;">"${inquiry.message}"</p>
            <p>Our customer service team will get back to you shortly via Email or WhatsApp.</p>
          </div>
        </div>
      `
    }).catch(e => console.error("Contact receipt email error", e));

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

    const inquiry = await Contact.findOne({ id });
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

    if (isWhatsApp) {
      // Build WhatsApp wa.me link
      let rawPhone = inquiry.phone || '';
      let cleanPhone = rawPhone.replace(/\D/g, ''); // strip non-digits
      if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
        cleanPhone = '91' + cleanPhone;
      }

      const encodedMessage = encodeURIComponent(
        `Hello ${inquiry.name},\n\nThank you for reaching out to Aureate Luxe regarding "${inquiry.subject}".\n\n*Response from Aureate Luxe Support*:\n${adminReply}\n\nWarm regards,\nAureate Luxe Team`
      );

      whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
      console.log(`WhatsApp Reply URL generated for ${inquiry.id}: ${whatsappUrl}`);

    } else {
      // Dispatch Email via Nodemailer
      await sendEmail({
        to: inquiry.email,
        subject: `Re: ${inquiry.subject} - Response from Aureate Luxe`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #FAF9F5; padding: 20px; color: #111;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #D4AF37; padding: 30px; border-radius: 12px;">
              <h2 style="color: #D4AF37; font-family: serif; text-align: center;">Aureate Luxe 1-Gram Jewellery</h2>
              <h3>Dear ${inquiry.name},</h3>
              <p>Thank you for contacting us. Here is our response to your inquiry regarding <strong>"${inquiry.subject}"</strong>:</p>
              <div style="background: #FAF9F5; padding: 15px; border-left: 4px solid #D4AF37; border-radius: 4px; margin: 20px 0;">
                <p style="margin: 0; white-space: pre-wrap;">${adminReply}</p>
              </div>
              <p style="font-size: 12px; color: #666;">Original Message: "${inquiry.message}"</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 11px; color: #888;">Aureate Luxe Support Team • 1 Gram Polish Replica Jewellery</p>
            </div>
          </div>
        `
      });
      console.log(`Email Reply dispatched for ${inquiry.id} to ${inquiry.email}`);
    }

    res.json({
      success: true,
      inquiry,
      whatsappUrl
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
