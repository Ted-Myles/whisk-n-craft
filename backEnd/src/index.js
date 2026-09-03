import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import supabase, { checkDatabaseConnection } from './config/supabase.js';
import recipesRoutes from './routes/recipes.routes.js';
import authRoutes from './routes/auth.routes.js';
import categoriesRoutes from './routes/categories.routes.js';

dotenv.config();

const app = express();

// Allowed origins: the public frontend (and later, the admin dashboard) —

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',');

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// mount routers
app.use('/api/recipes', recipesRoutes);   
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);

// centralized error handler — must be defined AFTER all routes
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});


checkDatabaseConnection();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});