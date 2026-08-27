import * as authService from '../services/auth.service.js';

export async function signup(req, res, next) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'username, email, and password are all required' });
        }
        const result = await authService.signup({ username, email, password });
        res.status(201).json(result);
    } catch (err) { next(err); }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'email and password are required' });
        }
        const result = await authService.login({ email, password });
        res.json(result);
    } catch (err) { next(err); }
}

export async function resendConfirmation(req, res, next) {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'email is required' });
        const result = await authService.resendConfirmation({ email });
        res.json(result);
    } catch (err) { next(err); }
}