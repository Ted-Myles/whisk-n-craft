
import { useState } from "react";
import "../components/styles/navbar.css";

import bake1 from "../assets/icons/bake1.png";
import book from "../assets/icons/book.png";
import logo from "../assets/icons/logo.png";

import { Link } from "react-router-dom";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="navbar-container">

            {/* LOGO */}
            <Link to="/" className="logo" onClick={closeMenu}>
                <img
                    src={logo}
                    alt="Bakers Paradise"
                    className="logoImage"
                />
            </Link>


            {/* DESKTOP NAVIGATION */}
            <div className="nav-icons">

                <Link to="/" className="btn">
                    <img
                        src={bake1}
                        alt="Home"
                        className="nav-icon"
                    />
                    <span className="span">Home</span>
                </Link>

                <Link to="/recipes" className="btn">
                    <img
                        src={book}
                        alt="All Recipes"
                        className="nav-icon"
                    />
                    <span className="span">All Recipes</span>
                </Link>

            </div>


            {/* HAMBURGER BUTTON */}
            <button
                className={`hamburger ${menuOpen ? "active" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>


            {/* MOBILE MENU */}
            <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>

                <Link
                    to="/"
                    className="mobile-menu-item"
                    onClick={closeMenu}
                >
                    <img src={bake1} alt="" />
                    <span>Home</span>
                </Link>

                <Link
                    to="/recipes"
                    className="mobile-menu-item"
                    onClick={closeMenu}
                >
                    <img src={book} alt="" />
                    <span>All Recipes</span>
                </Link>

            </div>

        </nav>
    );
}

