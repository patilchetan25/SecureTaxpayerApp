const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Email
    pass: process.env.EMAIL_PASS, // password
  },
});

const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${process.env.BASE_URL}/verify-email/${token}`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; text-align: center; color: #333; padding: 20px;">
      <h1 style="color: #4CAF50;">Welcome to Our Platform!</h1>
      <p style="font-size: 16px;">Thank you for registering. Please verify your email address to activate your account.</p>
      <a href="${verificationLink}" 
         style="display: inline-block; background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px;">
        Verify Email
      </a>
      <p style="font-size: 14px; color: #666; margin-top: 20px;">If you did not register, you can ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification',
    html: htmlContent,
  });
};

const sendUnlockAccountEmail = async (email, token) => {
    const unlockLink = `${process.env.BASE_URL}/unlock-account/${token}`;
    
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; text-align: center; color: #333; padding: 20px;">
            <h1 style="color: #FF0000;">Your Account Has Been Blocked</h1>
            <p style="font-size: 16px;">
                Your account has been blocked due to multiple failed login attempts.
                You can unlock your account by clicking the button below.
            </p>
            <a href="${unlockLink}" 
               style="display: inline-block; background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px;">
              Unlock Account
            </a>
            <p style="font-size: 14px; color: #666; margin-top: 20px;">If you did not request this, please contact support.</p>
        </div>
    `;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Account Unlock Request',
        html: htmlContent,
    });
};

module.exports = {
  sendVerificationEmail,
  sendUnlockAccountEmail,
};
