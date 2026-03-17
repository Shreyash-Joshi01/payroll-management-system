import { sendCredentialsEmail } from './emailService.js';
import dotenv from 'dotenv';
import path from 'path';

// Note: emailService.js already configures dotenv, but we do it here too just in case we need to read from it before it loads
dotenv.config({ path: path.resolve('../.env') });

async function testEmail() {
    const targetEmail = process.env.SMTP_USER;

    if (!targetEmail || targetEmail === 'your_email@gmail.com') {
        console.error("❌ It looks like SMTP_USER is not set or is still the default placeholder in .env.");
        process.exit(1);
    }

    console.log(`Starting email test. Sending to: ${targetEmail}...`);
    
    try {
        const result = await sendCredentialsEmail(targetEmail, "Test Setup User", "TestPassword123!");
        
        if (result.success) {
            console.log("✅ Email sent successfully! Message ID:", result.id);
        } else {
            console.error("❌ Failed to send email.");
            console.error("Error details:", result.error);
        }
    } catch (err) {
        console.error("❌ Unexpected error during test:", err);
    }
}

testEmail();
