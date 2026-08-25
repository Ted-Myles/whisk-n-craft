import React from "react";
import "./styles.css";

const Authentication: React.FC = () => {
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
                <form className="lf-10__form lf-10__form--login" noValidate>
                    <h2 className="lf-10__h">Sign in</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        required
                    />
                    <button type="submit">Log in</button>
                </form>

                {/* Signup Form */}
                <form className="lf-10__form lf-10__form--signup" noValidate>
                    <h2 className="lf-10__h">Create account</h2>
                    <input
                        type="text"
                        placeholder="Full name"
                        autoComplete="name"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        required
                    />
                    <button type="submit">Sign up</button>
                </form>

                {/* Overlay Panels */}
                <div className="lf-10__overlay">
                    <div className="lf-10__panel lf-10__panel--a">
                        <h3>New here?</h3>
                        <p>Create an account and start your free trial.</p>
                        <label className="lf-10__ghost" htmlFor="lf-10-mode">
                            Sign up
                        </label>
                    </div>
                    <div className="lf-10__panel lf-10__panel--b">
                        <h3>One of us?</h3>
                        <p>Sign in to pick up right where you left off.</p>
                        <label className="lf-10__ghost" htmlFor="lf-10-mode">
                            Log in
                        </label>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Authentication;
