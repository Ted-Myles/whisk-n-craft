
// Client-side validation — catches obvious mistakes before a round trip
// to the server. The server still re-validates everything; this is purely
// for fast feedback and fewer wasted requests.

export function validateEmail(email: string): string | null {
    const trimmed = email.trim();

    if (!trimmed) {
        return "Email is required.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return "Enter a valid email address.";
    }

    return null;
}

export function validatePassword(password: string): string | null {
    if (!password) {
        return "Password is required.";
    }

    if (password.length < 6) {
        return "Password must be at least 6 characters.";
    }

    return null;
}

export function validateConfirmPassword(
    password: string,
    confirmPassword: string
): string | null {
    if (!confirmPassword) {
        return "Please confirm your password.";
    }

    if (password !== confirmPassword) {
        return "Passwords do not match.";
    }

    return null;
}

export function validateUsername(username: string): string | null {
    const trimmed = username.trim();

    if (!trimmed) {
        return "Username is required.";
    }

    if (trimmed.length < 3) {
        return "Username must be at least 3 characters.";
    }

    if (trimmed.length > 30) {
        return "Username must be under 30 characters.";
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
        return "Only letters, numbers, and underscores are allowed.";
    }

    return null;
}


// Turns a raw Axios/API error into a message suitable for displaying
// to the user.
//
// The server remains responsible for real validation and authentication.
// This function only converts technical API errors into user-friendly
// messages.
//
// isUnconfirmed is used by the UI to decide whether to display the
// "Resend confirmation email" option.

export function getFriendlyAuthError(
    err: any
): {
    message: string;
    isUnconfirmed: boolean;
} {

    // =========================================================
    // NETWORK / CONNECTION ERROR
    // =========================================================
    //
    // The request was sent, but the client received no response.

    if (err?.request && !err?.response) {
        return {
            message:
                "Network error. Check your connection and try again.",
            isUnconfirmed: false
        };
    }


    // =========================================================
    // NO ERROR OBJECT / UNKNOWN ERROR
    // =========================================================

    if (!err) {
        return {
            message:
                "Something went wrong. Please try again.",
            isUnconfirmed: false
        };
    }


    // =========================================================
    // RESPONSE INFORMATION
    // =========================================================

    const status = err?.response?.status;

    const raw =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "";


    const errorMessage = String(raw).trim();


    // =========================================================
    // TOO MANY LOGIN ATTEMPTS
    // =========================================================

    if (status === 429) {
        return {
            message:
                "Too many attempts. Please wait a moment and try again.",
            isUnconfirmed: false
        };
    }


    // =========================================================
    // EMAIL NOT CONFIRMED
    // =========================================================

    if (
        /email not confirmed/i.test(errorMessage) ||
        /email_not_confirmed/i.test(errorMessage) ||
        /not confirmed/i.test(errorMessage)
    ) {
        return {
            message:
                "Please confirm your email before logging in.",
            isUnconfirmed: true
        };
    }


    // =========================================================
    // INCORRECT EMAIL OR PASSWORD
    // =========================================================
    //
    // Do not tell the user whether the email exists.
    // This gives the same message for an incorrect email
    // and an incorrect password.

    if (
        status === 401 ||
        /invalid login credentials/i.test(errorMessage) ||
        /invalid credentials/i.test(errorMessage) ||
        /incorrect email or password/i.test(errorMessage) ||
        /wrong password/i.test(errorMessage)
    ) {
        return {
            message:
                "Incorrect email or password.",
            isUnconfirmed: false
        };
    }


    // =========================================================
    // ACCOUNT ALREADY EXISTS
    // =========================================================

    if (
        status === 409 ||
        /already exists/i.test(errorMessage) ||
        /already registered/i.test(errorMessage) ||
        /user already registered/i.test(errorMessage)
    ) {
        return {
            message:
                "An account with this email already exists. Try logging in instead.",
            isUnconfirmed: false
        };
    }


    // =========================================================
    // INVALID EMAIL
    // =========================================================

    if (
        /invalid email/i.test(errorMessage) ||
        /email.*invalid/i.test(errorMessage)
    ) {
        return {
            message:
                "Please enter a valid email address.",
            isUnconfirmed: false
        };
    }


    // =========================================================
    // SERVER ERROR
    // =========================================================

    if (status && status >= 500) {
        return {
            message:
                "Something went wrong on the server. Please try again later.",
            isUnconfirmed: false
        };
    }


    // =========================================================
    // OTHER API ERROR
    // =========================================================

    if (errorMessage) {
        return {
            message: errorMessage,
            isUnconfirmed: false
        };
    }


    // =========================================================
    // FALLBACK
    // =========================================================

    return {
        message:
            "Something went wrong. Please try again.",
        isUnconfirmed: false
    };
};
