import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.resolve('../.env') });
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com', // fallback to Gmail
    port: parseInt(process.env.SMTP_PORT) || 465, // usually 465 for secure, 587 for TLS
    secure: process.env.SMTP_SECURE === 'true' || true, // true for 465, false for other ports
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * Sends login credentials to a newly registered employee.
 */
export async function sendCredentialsEmail(toEmail, firstName, password) {
    try {
        const info = await transporter.sendMail({
            from: process.env.FROM_EMAIL || '"Payroll System" <no-reply@payrollsystem.com>',
            to: toEmail,
            subject: 'Welcome — Your Payroll System Credentials',
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #1a1a2e; color: #e0e0e0; border-radius: 16px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #00d4ff; margin: 0; font-size: 22px;">Welcome to Payroll System</h1>
                    </div>
                    <p style="font-size: 15px; line-height: 1.6;">
                        Hi <strong style="color: #ffffff;">${firstName}</strong>,
                    </p>
                    <p style="font-size: 15px; line-height: 1.6;">
                        Your employee account has been created. Use the credentials below to log in:
                    </p>
                    <div style="background: #16213e; border: 1px solid #0f3460; border-radius: 12px; padding: 20px; margin: 20px 0;">
                        <p style="margin: 0 0 12px 0; font-size: 14px;">
                            <span style="color: #8899aa;">Email:</span><br/>
                            <strong style="color: #ffffff; font-size: 16px;">${toEmail}</strong>
                        </p>
                        <p style="margin: 0; font-size: 14px;">
                            <span style="color: #8899aa;">Password:</span><br/>
                            <strong style="color: #00d4ff; font-size: 16px;">${password}</strong>
                        </p>
                    </div>
                    <p style="font-size: 13px; color: #8899aa; line-height: 1.5;">
                        Please change your password after your first login for security purposes.
                    </p>
                    <hr style="border: none; border-top: 1px solid #0f3460; margin: 24px 0;" />
                    <p style="font-size: 12px; color: #556677; text-align: center; margin: 0;">
                        Payroll Management System &bull; This is an automated email
                    </p>
                </div>
            `
        });

        console.log('Credentials email sent successfully. Message ID:', info.messageId);
        return { success: true, id: info.messageId };
    } catch (err) {
        console.error('Failed to send credentials email:', err);
        return { success: false, error: err.message };
    }
}
