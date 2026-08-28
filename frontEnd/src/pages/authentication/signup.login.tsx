import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    signup,
    login,
    resendConfirmation
} from "../../utils/api/auth";

import {
    validateEmail,
    validatePassword,
    validateUsername,
    getFriendlyAuthError
} from "../../utils/api/authValidation";

import "./styles.css";

const RESEND_COOLDOWN_SECONDS = 30;

const Authentication: React.FC = () => {
    const navigate = useNavigate();

    // =========================================================
    // LOGIN
    // =========================================================

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [loginLoading, setLoginLoading] = useState(false);

    const [loginError, setLoginError] = useState<string | null>(null);

    const [loginNeedsConfirmation, setLoginNeedsConfirmation] =
        useState(false);

    // =========================================================
    // SIGNUP
    // =========================================================

    const [signupFullName, setSignupFullName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");

    const [signupLoading, setSignupLoading] = useState(false);

    const [signupError, setSignupError] = useState<string | null>(null);

    const [signupSuccess, setSignupSuccess] =
        useState<string | null>(null);

    // =========================================================
    // RESEND CONFIRMATION
    // =========================================================

    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] =
        useState<string | null>(null);

    const [resendCooldown, setResendCooldown] = useState(0);

    const cooldownRef =
        useRef<ReturnType<typeof setInterval> | undefined>(undefined);

    // =========================================================
    // RESEND COOLDOWN
    // =========================================================

    useEffect(() => {
        if (resendCooldown <= 0) return;

        cooldownRef.current = setInterval(() => {
            setResendCooldown((seconds) =>
                seconds <= 1 ? 0 : seconds - 1
            );
        }, 1000);

        return () => {
            if (cooldownRef.current) {
                clearInterval(cooldownRef.current);
            }
        };
    }, [resendCooldown]);

    // =========================================================
    // RESEND CONFIRMATION EMAIL
    // =========================================================

    async function handleResend(email: string) {
        if (
            resendCooldown > 0 ||
            resendLoading ||
            !email.trim()
        ) {
            return;
        }

        setResendLoading(true);
        setResendMessage(null);

        try {
            const result = await resendConfirmation(
                email.trim()
            );

            setResendMessage(result.message);
            setResendCooldown(
                RESEND_COOLDOWN_SECONDS
            );
        } catch (err) {
            const {message} =
                getFriendlyAuthError(err);

            setResendMessage(message);
        } finally {
            setResendLoading(false);
        }
    }

    // =========================================================
    // LOGIN
    // =========================================================

    async function handleLogin(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setLoginError(null);
        setLoginNeedsConfirmation(false);
        setResendMessage(null);

        // Validate email
        const emailError =
            validateEmail(loginEmail);

        // Validate password
        const passwordError =
            loginPassword
                ? null
                : "Password is required.";

        if (emailError) {
            setLoginError(emailError);
            return;
        }

        if (passwordError) {
            setLoginError(passwordError);
            return;
        }

        setLoginLoading(true);

        try {
            await login({
                email: loginEmail.trim(),
                password: loginPassword
            });

            // Login successful
            navigate("/");
        } catch (err) {
            const {
                message,
                isUnconfirmed
            } = getFriendlyAuthError(err);

            setLoginError(message);
            setLoginNeedsConfirmation(
                isUnconfirmed
            );
        } finally {
            setLoginLoading(false);
        }
    }

    // =========================================================
    // SIGNUP
    // =========================================================

    async function handleSignup(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setSignupError(null);
        setSignupSuccess(null);
        setResendMessage(null);

        // Full name is used as username because
        // the original layout has no separate username field.
        const usernameError =
            validateUsername(signupFullName);

        const emailError =
            validateEmail(signupEmail);

        const passwordError =
            validatePassword(signupPassword);

        if (usernameError) {
            setSignupError(usernameError);
            return;
        }

        if (emailError) {
            setSignupError(emailError);
            return;
        }

        if (passwordError) {
            setSignupError(passwordError);
            return;
        }

        setSignupLoading(true);

        try {
            const result = await signup({
                username: signupFullName.trim(),
                email: signupEmail.trim(),
                password: signupPassword
            });

            setSignupSuccess(result.message);

            // Clear form after successful registration
            setSignupFullName("");
            setSignupEmail("");
            setSignupPassword("");
        } catch (err) {
            const {message} =
                getFriendlyAuthError(err);

            setSignupError(message);
        } finally {
            setSignupLoading(false);
        }
    }

    // =========================================================
    // UI
    // =========================================================

    return (
        <section className="lf-10">
            <div className="lf-10__stage">

                <input
                    type="checkbox"
                    className="lf-10__toggle"
                    id="lf-10-mode"
                    aria-label="Switch between login and sign up"
                />

                {/* Login Form */}
                <form
                    className="lf-10__form lf-10__form--login"
                    noValidate
                    onSubmit={handleLogin}
                >
                    <h2 className="lf-10__h">
                        Sign in
                    </h2>

                    <input
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        required
                        value={loginEmail}
                        disabled={loginLoading}
                        onChange={(e) => {
                            setLoginEmail(
                                e.target.value
                            );
                            setLoginError(null);
                        }}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        required
                        value={loginPassword}
                        disabled={loginLoading}
                        onChange={(e) => {
                            setLoginPassword(
                                e.target.value
                            );
                            setLoginError(null);
                        }}
                    />

                    <button
                        type="submit"
                        disabled={loginLoading}
                    >
                        {loginLoading
                            ? "Signing in…"
                            : "Log in"}
                    </button>

                    {loginError && (
                        <div
                            className="lf-10__banner lf-10__banner--error"
                            role="alert"
                        >
                            <p>{loginError}</p>

                            {loginNeedsConfirmation && (
                                <button
                                    type="button"
                                    className="lf-10__resend"
                                    onClick={() =>
                                        handleResend(
                                            loginEmail
                                        )
                                    }
                                    disabled={
                                        resendLoading ||
                                        resendCooldown > 0
                                    }
                                >
                                    {resendLoading
                                        ? "Sending…"
                                        : resendCooldown > 0
                                            ? `Resend available in ${resendCooldown}s`
                                            : "Resend confirmation email"}
                                </button>
                            )}

                            {resendMessage && (
                                <p className="lf-10__resend-message">
                                    {resendMessage}
                                </p>
                            )}
                        </div>
                    )}
                </form>

                {/* Signup Form */}
                <form
                    className="lf-10__form lf-10__form--signup"
                    noValidate
                    onSubmit={handleSignup}
                >
                    <h2 className="lf-10__h">
                        Create account
                    </h2>

                    <input
                        type="text"
                        placeholder="username"
                        autoComplete="name"
                        required
                        value={signupFullName}
                        disabled={signupLoading}
                        onChange={(e) => {
                            setSignupFullName(
                                e.target.value
                            );
                            setSignupError(null);
                        }}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        required
                        value={signupEmail}
                        disabled={signupLoading}
                        onChange={(e) => {
                            setSignupEmail(
                                e.target.value
                            );
                            setSignupError(null);
                        }}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        required
                        value={signupPassword}
                        disabled={signupLoading}
                        onChange={(e) => {
                            setSignupPassword(
                                e.target.value
                            );
                            setSignupError(null);
                        }}
                    />

                    <button
                        type="submit"
                        disabled={signupLoading}
                    >
                        {signupLoading
                            ? "Creating account…"
                            : "Sign up"}
                    </button>

                    {signupError && (
                        <p
                            className="lf-10__banner lf-10__banner--error"
                            role="alert"
                        >
                            {signupError}
                        </p>
                    )}

                    {signupSuccess && (
                        <div
                            className="lf-10__banner lf-10__banner--success"
                            role="status"
                        >
                            <p>{signupSuccess}</p>

                            <button
                                type="button"
                                className="lf-10__resend"
                                onClick={() =>
                                    handleResend(
                                        signupEmail
                                    )
                                }
                                disabled={
                                    resendLoading ||
                                    resendCooldown > 0
                                }
                            >
                                {resendLoading
                                    ? "Sending…"
                                    : resendCooldown > 0
                                        ? `Resend available in ${resendCooldown}s`
                                        : "Didn't get it? Resend email"}
                            </button>

                            {resendMessage && (
                                <p className="lf-10__resend-message">
                                    {resendMessage}
                                </p>
                            )}
                        </div>
                    )}
                </form>

                {/* Overlay Panels */}
                <div className="lf-10__overlay">
                    <div className="lf-10__panel lf-10__panel--a">
                        <h3>Don't have an account</h3>
                        <p>
                            Create an account and join the community.
                        </p>

                        <label
                            className="lf-10__ghost"
                            htmlFor="lf-10-mode"
                        >
                            Sign up
                        </label>
                    </div>

                    <div className="lf-10__panel lf-10__panel--b">
                        <h3>Already have an account?</h3>
                        <p>
                            {/*Sign in to pick up right*/}
                            {/*where you left off.*/}
                        </p>

                        <label
                            className="lf-10__ghost"
                            htmlFor="lf-10-mode"
                        >
                            Log in
                        </label>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Authentication;