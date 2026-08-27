import react from "react";
import "../components/styles/navbar.css";
import bake1 from "../assets/icons/bake1.png";
import book from "../assets/icons/book.png";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="navbar-container">


        <div
            className="btn"
            onClick={() => window.location.href = "/"}
        >
            <img src={bake1} alt="Home" className="nav-icon" />
            <span className="span">Home</span>
        </div>



        <div className="btn">
        <img src={book} alt="Home" className="nav-icon" />
        <span className="span">All Recipes</span>
      </div>
    </div>
  );
}
