const nodemailer = require('nodemailer');

// Simple email service that works without complex setup
class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Try to create transporter with available config
    try {
      this.transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER || 'noreply@telanganatourism.com',
          pass: process.env.EMAIL_PASS || 'dummy_password'
        }
      });
    } catch (error) {
      console.log('Email transporter not configured, using console logging');
      this.transporter = null;
    }
  }

  async sendReviewEmail(reviewData) {
    const emailContent = this.formatReviewEmail(reviewData);
    
    // Always log the review to console for immediate visibility
    console.log('\n' + '='.repeat(60));
    console.log('📧 NEW REVIEW RECEIVED');
    console.log('='.repeat(60));
    console.log(`👤 Name: ${reviewData.name}`);
    console.log(`📧 Email: ${reviewData.email}`);
    console.log(`⭐ Rating: ${reviewData.rating}/5`);
    console.log(`📝 Title: ${reviewData.title}`);
    console.log(`💬 Comment: ${reviewData.comment}`);
    console.log(`📍 Place: ${reviewData.place || 'Not specified'}`);
    console.log(`🎉 Festival: ${reviewData.festival || 'Not specified'}`);
    console.log(`📅 Date: ${new Date().toLocaleString()}`);
    console.log('='.repeat(60) + '\n');

    // Try to send actual email if configured
    if (this.transporter && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: 'kothasruthikarreddy11@gmail.com',
          subject: `New Review: ${reviewData.title}`,
          html: emailContent
        };

        await this.transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully to kothasruthikarreddy11@gmail.com');
      } catch (error) {
        console.error('❌ Email sending failed:', error.message);
        console.log('📋 Review logged to console above');
      }
    } else {
      console.log('📋 Email not configured - review logged to console above');
      console.log('💡 To enable email: Set EMAIL_USER and EMAIL_PASS in .env file');
    }
  }

  formatReviewEmail(reviewData) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
        <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #667eea; text-align: center; margin-bottom: 30px;">
            🎉 New Review Received
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Review Details</h3>
            <p><strong>👤 Name:</strong> ${reviewData.name}</p>
            <p><strong>📧 Email:</strong> ${reviewData.email}</p>
            <p><strong>⭐ Rating:</strong> ${reviewData.rating}/5</p>
            <p><strong>📝 Title:</strong> ${reviewData.title}</p>
            <p><strong>💬 Comment:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea; margin: 10px 0;">
              ${reviewData.comment}
            </div>
            <p><strong>📍 Place:</strong> ${reviewData.place || 'Not specified'}</p>
            <p><strong>🎉 Festival:</strong> ${reviewData.festival || 'Not specified'}</p>
            <p><strong>📅 Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>This review was submitted through the Telangana Tourism website contact form.</p>
          </div>
        </div>
      </div>
    `;
  }
}

module.exports = new EmailService();
