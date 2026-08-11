import { useEffect, useState } from "react";

import "../components/styles/banner.css";


import cake1 from "../assets/images/cake3.jpg";
import cake2 from "../assets/images/cake2.jpg";
const Banner = () => {
  return (
    // <div className="banner" style={{backgroundImage: `linear-gradient(to right, rgba(167, 91, 10, 0.66), rgba(0,0,0,0.5)), url(${cake1})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '200px'}}>
    
      
  <div className="banner">
  <div
    className="banner-img banner-img--left"
    style={{ backgroundImage: `linear-gradient(to right, rgba(171, 42, 42, 0.34)),url(${cake1})` }}
  />
  <div
    className="banner-img banner-img--right"
    style={{ backgroundImage: `linear-gradient(to left, rgba(96, 71, 71, 0.41)),url(${cake2})` }}
  />

</div>
  );
}

export default Banner;