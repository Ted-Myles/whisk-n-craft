import react from "react";
import "../components/styles/navbar.css";
import bake1 from "../assets/icons/bake1.png";
import book from "../assets/icons/book.png";

export default function Navbar() {
  return (
    <div className="navbar-container">

      
      <div className="btn">
        <img src={bake1} alt="Home" className="bake1" />
        <span className="span">Home</span>
        
      </div>
      <div className="btn">
        <img src={book} alt="Home" className="bake1" />
        <span className="span">All Recipes</span>
      </div>
    </div>
  );
}
