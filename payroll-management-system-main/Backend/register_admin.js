import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Error: Missing SUPABASE_URL or SUPABASE_KEY in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function registerAdmin() {
    console.log("Attempting to register admin: admin@gmail.com...");

    const { data, error } = await supabase.auth.signUp({
        email: 'shrey.admin@gmail.com',
        password: 'admin123',
        options: {
            data: {
                role: 'Admin',
                first_name: 'Shrey',
                last_name: 'Administrator'
            }
        }
    });

    if (error) {
        if (error.status === 400 && error.message.includes('already registered')) {
            console.log("Success: User already exists.");
        } else {
            console.error("Error registering admin:", error.message);
        }
    } else {
        console.log("Success: Admin user created!");
        console.log("Note: If email confirmation is enabled in Supabase, you must confirm the email or disable confirmation in the dashboard to log in.");
    }
}

registerAdmin();
