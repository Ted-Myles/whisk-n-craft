import supabase from '../config/supabase.js';
import pool from '../config/db.js';

export async function signup({ username, email, password }) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { username },                                   // stored on the Supabase user's metadata
            emailRedirectTo: process.env.EMAIL_CONFIRM_REDIRECT_URL, // where the confirmation link sends them
        },
    });

    if (error) {
        const err = new Error(error.message);
        err.status = 400;
        throw err;
    }

    // Supabase's anti-enumeration behavior: signing up with an email that
    // already has a confirmed account returns a 200 with no identities,
    // instead of an explicit "already registered" error. Catch that here.
    if (data.user && data.user.identities && data.user.identities.length === 0) {
        const err = new Error('An account with this email already exists.');
        err.status = 409;
        throw err;
    }

    // The auth.users row exists immediately, even before the email is
    // confirmed — create the matching profile now so display_name is set
    // from the start rather than waiting for their first review.
    if (data.user) {
        await pool.query(
            `INSERT INTO member_profiles (id, display_name) VALUES ($1, $2)
       ON CONFLICT (id) DO NOTHING`,
            [data.user.id, username]
        );
    }

    return { message: 'Account created. Check your email to confirm before logging in.' };
}

export async function login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        // Supabase itself returns "Email not confirmed" here if the user
        // hasn't clicked the confirmation link yet — no custom check needed.
        const err = new Error(error.message);
        err.status = 401;
        throw err;
    }

    return {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        user: { id: data.user.id, email: data.user.email },
    };
}

export async function resendConfirmation({ email }) {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) {
        const err = new Error(error.message);
        err.status = 400;
        throw err;
    }
    return { message: 'Confirmation email resent.' };
}