import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  throw new Error('SUPABASE_URL is not defined');
}

if (!supabasePublishableKey) {
  throw new Error('SUPABASE_PUBLISHABLE_KEY is not defined');
}

// Supabase client
const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);

// Check database connection
export const checkDatabaseConnection = async () => {
  try {
    const { error } = await supabase
      .from('baked_goods')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ SUPABASE DATABASE CONNECTION FAILED:', error.message);
      return false;
    }

    console.log('✅ SUPABASE DATABASE CONNECTED...');
    return true;
  } catch (error) {
    console.error('❌ SUPABASE CONNECTION ERROR:', error.message);
    return false;
  }
};

export default supabase;
