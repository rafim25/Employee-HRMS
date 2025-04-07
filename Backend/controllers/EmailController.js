import nodemailer from "nodemailer";

// Create a transporter using SMTP with optimized timeout settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.mail.yahoo.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  debug: false, // Disable debug logs in production
  logger: false, // Disable logger in production
  tls: {
    rejectUnauthorized: false,
    ciphers: "SSLv3", // Add legacy cipher support
  },
  // Reduce timeout settings
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000, // 10 seconds
  socketTimeout: 15000, // 15 seconds
  pool: true, // Enable connection pooling
  maxConnections: 3, // Maximum number of connections
  maxMessages: 50, // Maximum number of messages per connection
  rateDelta: 1000, // Define the time window for rate limiting
  rateLimit: 3, // Maximum number of messages per rateDelta
});

// Helper function to send email with timeout
const sendEmailWithTimeout = async (mailOptions) => {
  return Promise.race([
    transporter.sendMail(mailOptions),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Email sending timeout")), 30000)
    ),
  ]);
};

// Test email function
export const testEmailDelivery = async (req, res) => {
  try {
    // Verify SMTP connection with timeout
    await Promise.race([
      new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
          if (error) {
            console.log("SMTP Verification Error:", error);
            reject(error);
          } else {
            console.log("SMTP Server is ready to take our messages");
            resolve(success);
          }
        });
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("SMTP verification timeout")), 10000)
      ),
    ]);

    // Send test email to admin(s)
    const adminEmails = process.env.ADMIN_EMAIL.split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "mrafee1910@gmail.com");

    const testMailOptions = {
      from: `"Raghav Elite Projects Test" <${process.env.SMTP_USER}>`,
      to: adminEmails.join(", "),
      bcc: "mrafee1910@gmail.com",
      subject: "Email Delivery Test",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; background-color: #fff;">
          <h2 style="color: #3C50E0; margin-bottom: 20px;">Email System Test</h2>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin: 10px 0;"><strong style="color: #333;">Status:</strong> Test Email</p>
            <p style="margin: 10px 0;"><strong style="color: #333;">Time:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
            <p style="margin: 0 0 10px 0;"><strong style="color: #333;">Configuration:</strong></p>
            <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
              <li>SMTP Host: ${process.env.SMTP_HOST}</li>
              <li>From: ${process.env.SMTP_USER}</li>
              <li>To: ${adminEmails.join(", ")}</li>
            </ul>
          </div>

          <div style="margin-top: 20px; padding: 15px; border-radius: 5px; background-color: #e8f5e9; color: #2e7d32;">
            <p style="margin: 0; text-align: center;">✅ If you received this email, the email delivery system is working correctly.</p>
          </div>

          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px; text-align: center;">This is an automated test email from Raghav Elite Projects.</p>
        </div>
      `,
    };

    const result = await transporter.sendMail(testMailOptions);
    console.log("Test email sent:", result.messageId);

    // Send success response with enhanced message
    res.status(200).json({
      success: true,
      message: "Test email sent successfully! ✅",
      details: {
        status: "Email system is working correctly",
        notification: "Test email has been sent to administrators",
        configuration: {
          from: process.env.SMTP_USER,
          to: adminEmails,
          bcc: "mrafee1910@gmail.com",
          messageId: result.messageId,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Test email error:", error);

    // Enhanced error response
    const errorResponse = {
      success: false,
      message: "Failed to send test email",
      details: {
        error: error.message,
        code: error.code,
        command: error.command,
        suggestion: "Please check SMTP configuration and try again.",
        timestamp: new Date().toISOString(),
      },
    };

    // Set appropriate status code based on error type
    const statusCode = error.code === "ETIMEDOUT" ? 504 : 500;
    res.status(statusCode).json(errorResponse);
  }
};

// Send contact form email
export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name and message",
      });
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email address",
        });
      }
    }

    // Verify SMTP connection with timeout
    await Promise.race([
      new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
          if (error) {
            console.log("SMTP Verification Error:", error);
            reject(error);
          } else {
            console.log("SMTP Server is ready to take our messages");
            resolve(success);
          }
        });
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("SMTP verification timeout")), 30000)
      ),
    ]);

    // Format admin emails
    const adminEmails = process.env.ADMIN_EMAIL.split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "mrafee1910@gmail.com");

    // Email to admin(s)
    const adminMailOptions = {
      from: `"Raghav Elite Projects" <${process.env.SMTP_USER}>`,
      to: adminEmails.join(", "),
      bcc: "mrafee1910@gmail.com",
      subject: "New Contact Form Submission - Raghav Elite Projects",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; background-color: #fff;">
          <h2 style="color: #3C50E0; margin-bottom: 20px;">New Contact Form Submission</h2>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin: 10px 0;"><strong style="color: #333;">Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong style="color: #333;">Email:</strong> ${
              email || "Not provided"
            }</p>
            <p style="margin: 10px 0;"><strong style="color: #333;">Phone:</strong> ${
              phone || "Not provided"
            }</p>
          </div>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
            <p style="margin: 0 0 10px 0;"><strong style="color: #333;">Message:</strong></p>
            <p style="margin: 0; line-height: 1.6;">${message}</p>
          </div>
        </div>
      `,
    };

    // Send admin email
    const adminResult = await transporter.sendMail(adminMailOptions);
    console.log("Admin email sent:", adminResult.messageId);

    // Auto-reply to user only if email is provided
    let userResult = null;
    if (email) {
      const userMailOptions = {
        from: `"Raghav Elite Projects" <${process.env.SMTP_USER}>`,
        to: email,
        bcc: "mrafee1910@gmail.com",
        subject: "Thank you for contacting Raghav Elite Projects",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; background-color: #fff;">
            <h2 style="color: #3C50E0; margin-bottom: 20px;">Thank You for Contacting Us!</h2>
            <p style="margin-bottom: 15px;">Dear ${name},</p>
            <p style="margin-bottom: 15px; line-height: 1.6;">We have received your message and will get back to you shortly.</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; line-height: 1.6;">${message}</p>
            </div>
            <p style="margin: 0 0 5px 0;"><strong>Best regards,</strong><br>Raghav Elite Projects Team</p>
          </div>
        `,
      };

      userResult = await transporter.sendMail(userMailOptions);
      console.log("User email sent:", userResult.messageId);
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: "Thank you! Your message has been sent successfully! ✅",
      details: {
        status: "Email system is working correctly",
        notification: email
          ? "Your message has been sent and you will receive a confirmation email"
          : "Your message has been sent successfully",
        configuration: {
          from: process.env.SMTP_USER,
          to: {
            admin: adminEmails,
            user: email || "Not provided",
          },
          bcc: "mrafee1910@gmail.com",
          messageIds: {
            admin: adminResult.messageId,
            user:
              userResult?.messageId ||
              "No confirmation email sent (no email provided)",
          },
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Contact form error:", error);

    // Enhanced error response
    const errorResponse = {
      success: false,
      message: "Failed to send message",
      details: {
        error: error.message,
        code: error.code,
        command: error.command,
        suggestion:
          "Please check your input and try again, or contact us directly at +91 9686918665",
        timestamp: new Date().toISOString(),
      },
    };

    // Set appropriate status code based on error type
    const statusCode = error.code === "ETIMEDOUT" ? 504 : 500;
    res.status(statusCode).json(errorResponse);
  }
};
// Add this new function to send candidate details to client
export const sendCandidatesToClient = async (req, res) => {
    try {
        const { jobId, clientEmail, clientName, jobTitle, candidates } = req.body;

        // Filter only shortlisted candidates
        const shortlistedCandidates = candidates.filter(c => c.status === 'shortlisted');

        if (!shortlistedCandidates?.length) {
            return res.status(400).json({
                success: false,
                message: "No shortlisted candidates to share"
            });
        }

        // Create HTML table of candidate details with resume link
        const candidateTableRows = shortlistedCandidates.map((candidate, index) => `
            <tr style="background-color: ${index % 2 === 0 ? '#f8f9fa' : '#ffffff'}">
                <td style="padding: 12px; border: 1px solid #dee2e6;">${candidate.name}</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${candidate.experience} years</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${candidate.location || 'Not specified'}</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${candidate.expectedSalary || 'Not specified'} LPA</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">
                    ${candidate.resume_url ? 
                        `<a href="${candidate.resume_url}" style="color: #3C50E0; text-decoration: underline;" target="_blank">View Resume</a>` : 
                        'Not available'
                    }
                </td>
            </tr>
        `).join('');

        const mailOptions = {
            from: `"Seven Wings Technologies" <${process.env.SMTP_USER}>`,
            to: clientEmail,
            bcc: "mrafee1910@gmail.com",
            subject: `Shortlisted Candidates for ${jobTitle}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; background-color: #fff;">
                    <h2 style="color: #3C50E0; margin-bottom: 20px;">Shortlisted Candidates</h2>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                        <p style="margin: 10px 0;"><strong style="color: #333;">Dear ${clientName},</strong></p>
                        <p style="margin: 10px 0;">We are pleased to share ${shortlistedCandidates.length} shortlisted candidate(s) for the position of ${jobTitle}.</p>
                    </div>

                    <div style="margin-top: 20px; overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; border: 1px solid #dee2e6;">
                            <thead>
                                <tr style="background-color: #3C50E0; color: white;">
                                    <th style="padding: 12px; border: 1px solid #dee2e6;">Name</th>
                                    <th style="padding: 12px; border: 1px solid #dee2e6;">Experience</th>
                                    <th style="padding: 12px; border: 1px solid #dee2e6;">Location</th>
                                    <th style="padding: 12px; border: 1px solid #dee2e6;">Expected CTC</th>
                                    <th style="padding: 12px; border: 1px solid #dee2e6;">Resume</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${candidateTableRows}
                            </tbody>
                        </table>
                    </div>

                    <div style="margin-top: 20px; padding: 15px; border-radius: 5px; background-color: #e8f5e9; color: #2e7d32;">
                        <p style="margin: 0;">You can click on the resume links in the table to view each candidate's resume directly.</p>
                        <p style="margin: 10px 0 0 0;">Additionally, the resumes are also attached to this email for your convenience.</p>
                    </div>

                    <div style="margin-top: 20px; padding: 15px; border-radius: 5px; background-color: #fff3e0; color: #e65100;">
                        <p style="margin: 0;">Note: Resume links will expire in 24 hours for security purposes.</p>
                    </div>

                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
                    <p style="color: #666; font-size: 12px; text-align: center;">This is an automated email from Seven Wings Technologies.</p>
                </div>
            `,
            attachments: shortlistedCandidates
                .filter(candidate => candidate.resume_url)
                .map(candidate => ({
                    filename: `${candidate.name.replace(/\s+/g, '_')}_Resume.pdf`,
                    path: candidate.resume_url
                }))
        };

        // Send email with timeout using existing transporter
        const result = await Promise.race([
            transporter.sendMail(mailOptions),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Email sending timeout")), 30000)
            )
        ]);

        // Send success response
        res.status(200).json({
            success: true,
            message: `Successfully shared ${shortlistedCandidates.length} shortlisted candidates`,
            details: {
                sharedWith: clientEmail,
                candidatesCount: shortlistedCandidates.length,
                messageId: result.messageId,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error("Share candidates email error:", error);
        
        const errorResponse = {
            success: false,
            message: "Failed to send candidates to client",
            details: {
                error: error.message,
                code: error.code,
                command: error.command,
                suggestion: "Please check email configuration and try again.",
                timestamp: new Date().toISOString()
            }
        };

        const statusCode = error.code === "ETIMEDOUT" ? 504 : 500;
        res.status(statusCode).json(errorResponse);
    }
};

