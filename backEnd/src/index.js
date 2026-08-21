import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import supabase, { checkDatabaseConnection } from './config/supabase.js';
import recipesRoutes from './routes/recipes.routes.js';

dotenv.config();

const app = express();

// Allowed origins: the public frontend (and later, the admin dashboard) —
// keep this as an env var so production doesn't need a code change.
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',');

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// mount routers
app.use('/api/recipes', recipesRoutes);   // <-- this line was missing before, causing "Cannot GET"

// centralized error handler — must be defined AFTER all routes
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// Check Supabase database
checkDatabaseConnection();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});