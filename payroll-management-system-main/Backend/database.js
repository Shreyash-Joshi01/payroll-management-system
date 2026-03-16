import { createClient } from '@supabase/supabase-js';
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve("../.env") });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env file");
}

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Service Key Status:", supabaseServiceKey ? "Present (Length: " + supabaseServiceKey.length + ")" : "Missing");

export const supabase = createClient(supabaseUrl, supabaseKey);

// Use service role key for admin actions (like creating users)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  : null;

console.log("Supabase Admin Client initialized:", !!supabaseAdmin);

export default supabase;
