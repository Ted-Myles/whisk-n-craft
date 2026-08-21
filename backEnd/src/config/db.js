import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Use Supabase's own Postgres connection string here (Project Settings ->
// Database -> Connection string). Supabase requires SSL.
const pool = new Pool({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false },
});

export default pool;