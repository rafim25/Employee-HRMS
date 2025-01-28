import nodemailer from "nodemailer";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // your email
    pass: process.env.SMTP_PASS, // your email password or app-specific password
  },
});

// Send contact form email
export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Email to admin
    const adminMailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL, // Admin's email address
      subject: "New Contact Form Submission - Raghav Elite Projects",
      html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
    };

    // Auto-reply to user
    const userMailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Thank you for contacting Raghav Elite Projects",
      html: `
                <h2>Thank you for contacting us!</h2>
                <p>Dear ${name},</p>
                <p>We have received your message and will get back to you shortly.</p>
                <p>Here's a copy of your message:</p>
                <p>${message}</p>
                <br>
                <p>Best regards,</p>
                <p>Raghav Elite Projects Team</p>
                <p>Contact: +91 9686918665</p>
                <p>Email: info@raghavprojects.com</p>
            `,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    res.status(200).json({
      success: true,
      message:
        "Your message has been sent successfully. We will contact you soon!",
    });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
};
