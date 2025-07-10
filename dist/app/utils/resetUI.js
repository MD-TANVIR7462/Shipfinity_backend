"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resetUI = (resetUILink) => {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #444;">Password Reset Request</h2>
      <p>Hello,</p>
      <p>We received a request to reset the password for your account. If you did not make this request, please ignore this email.</p>
      <p>To reset your password, please click on the button below:</p>
      <p style="text-align: center;">
          <a href="${resetUILink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 6px;">Reset Password</a>
      </p>
      <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
      <p><a href="${resetUILink}">${resetUILink}</a></p>
      <p>This link will expire in 5 minutes for security reasons.</p>
      <p>If you didn't request a password reset, please contact GizmoBuy support team immediately.</p>
      <p>Best regards,<br>Babul Akter <br> GizmoBuy - your trusted ecommerce shop</p>
  </body>
  </html>
  `;
};
exports.default = resetUI;
