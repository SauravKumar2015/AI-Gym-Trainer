package com.iar.backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${mail.from:AiGymTrainer@gmail.com}")
    private String fromEmail;

    @Value("${mail.from.name:FitAI Pro}")
    private String fromName;

    /**
     * Send OTP verification code via email
     */
    public void sendOtpEmail(String toEmail, String otp, String userName)
            throws MessagingException, UnsupportedEncodingException {
        logger.info("Attempting to send OTP email to: {}", toEmail);
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail, fromName);
        helper.setTo(toEmail);
        helper.setSubject("🔐 FitAI Pro - Password Reset Code");

        String htmlContent = String.format(
                """
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="UTF-8">
                            <style>
                                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
                                .container { max-width: 500px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                                .header { background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 30px 20px; text-align: center; color: white; }
                                .header h1 { margin: 0; font-size: 24px; }
                                .content { padding: 30px 20px; }
                                .otp-box { background: linear-gradient(135deg, #f3f4f6, #e5e7eb); border: 2px solid #7c3aed; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                                .otp-code { font-size: 32px; font-weight: bold; color: #7c3aed; letter-spacing: 4px; font-family: monospace; }
                                .info-text { color: #666; font-size: 14px; line-height: 1.6; margin: 15px 0; }
                                .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; border-radius: 4px; font-size: 13px; color: #92400e; margin: 15px 0; }
                                .footer { text-align: center; padding: 20px; background-color: #f9fafb; font-size: 12px; color: #999; border-top: 1px solid #e5e7eb; }
                                .button { display: inline-block; margin-top: 20px; padding: 12px 24px; background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; text-decoration: none; border-radius: 6px; font-weight: 600; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1>🏋️ FitAI Pro</h1>
                                    <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Password Reset Request</p>
                                </div>

                                <div class="content">
                                    <p class="info-text">Hi <strong>%s</strong>,</p>

                                    <p class="info-text">You requested a password reset for your FitAI Pro account. Use the following code to reset your password:</p>

                                    <div class="otp-box">
                                        <div class="otp-code">%s</div>
                                    </div>

                                    <p class="info-text" style="text-align: center; color: #999; font-size: 13px;">Code expires in <strong>1 minute</strong></p>

                                    <div class="warning">
                                        ⚠️ <strong>Security Notice:</strong> Never share this code with anyone. Our team will never ask for this code.
                                    </div>

                                    <p class="info-text">If you didn't request this password reset, please ignore this email and your account will remain secure.</p>

                                    <p class="info-text">
                                        <strong>Questions?</strong> Contact our support team at support@fitaipro.com
                                    </p>
                                </div>

                                <div class="footer">
                                    <p style="margin: 0;">© 2024 FitAI Pro. All rights reserved.</p>
                                    <p style="margin: 5px 0 0 0;">This is an automated message. Please do not reply.</p>
                                </div>
                            </div>
                        </body>
                        </html>
                        """,
                userName, otp);

        helper.setText(htmlContent, true);
        javaMailSender.send(message);
    }

    /**
     * Send password reset confirmation email
     */
    public void sendPasswordResetConfirmation(String toEmail, String userName)
            throws MessagingException, UnsupportedEncodingException {
        logger.info("Attempting to send password reset confirmation email to: {}", toEmail);
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail, fromName);
        helper.setTo(toEmail);
        helper.setSubject("✅ FitAI Pro - Password Reset Successful");

        String htmlContent = String.format(
                """
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="UTF-8">
                            <style>
                                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
                                .container { max-width: 500px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                                .header { background: linear-gradient(135deg, #10b981, #059669); padding: 30px 20px; text-align: center; color: white; }
                                .header h1 { margin: 0; font-size: 24px; }
                                .content { padding: 30px 20px; }
                                .success-box { background: #f0fdf4; border: 2px solid #10b981; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                                .success-icon { font-size: 40px; }
                                .info-text { color: #666; font-size: 14px; line-height: 1.6; margin: 15px 0; }
                                .footer { text-align: center; padding: 20px; background-color: #f9fafb; font-size: 12px; color: #999; border-top: 1px solid #e5e7eb; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1>🏋️ FitAI Pro</h1>
                                    <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Password Reset Successful</p>
                                </div>

                                <div class="content">
                                    <div class="success-box">
                                        <div class="success-icon">✅</div>
                                        <p style="margin: 10px 0 0 0; color: #10b981; font-weight: 600;">Password Updated Successfully!</p>
                                    </div>

                                    <p class="info-text">Hi <strong>%s</strong>,</p>

                                    <p class="info-text">Your password has been successfully reset. You can now log in to your FitAI Pro account with your new password.</p>

                                    <p class="info-text">If you did not make this change, please contact our support team immediately at support@fitaipro.com</p>

                                    <p class="info-text">
                                        <strong>Next Steps:</strong><br>
                                        1. Log in with your new password<br>
                                        2. Keep your password secure<br>
                                        3. Consider enabling two-factor authentication
                                    </p>
                                </div>

                                <div class="footer">
                                    <p style="margin: 0;">© 2024 FitAI Pro. All rights reserved.</p>
                                    <p style="margin: 5px 0 0 0;">This is an automated message. Please do not reply.</p>
                                </div>
                            </div>
                        </body>
                        </html>
                        """,
                userName);

        helper.setText(htmlContent, true);
        javaMailSender.send(message);
    }

    /**
     * Send simple text email
     */
    public void sendSimpleEmail(String toEmail, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            javaMailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }
}
