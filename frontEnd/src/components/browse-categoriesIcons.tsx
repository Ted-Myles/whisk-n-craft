import type { ReactElement } from "react";
import "../components/browse-categories/browse-categoriesIcons.css";
import bread from "../assets/images/bread.jpg";
import cookies from "../assets/images/cookies.jpg";
import cake from "../assets/images/cake.jpg";
import cupcake from "../assets/images/cupcake.jpg";
import pizza from "../assets/images/pizza.jpg";

const BrowseCategoriesIcons = (): ReactElement => {
  return (
    <div className="categories-icons" >

      <div className="cat-icons" color="blue">
        <img src={cake} alt="Home" className="image-icon" />
          <h1 className="icons-title">Cakes</h1>
      </div>
        <div className="cat-icons">
            <img src={bread} alt="Home" className="image-icon"/>
            <h1 className="icons-title">Bread</h1>

        </div>
      <div className="cat-icons">
        <img src={cookies} alt="Home" className="image-icon"/>
          <h1 className="icons-title">Cookies</h1>
      </div>


        <div className="cat-icons">
        <img src={cupcake} alt="Home" className="image-icon"/>
        <h1 className="icons-title">Cupcakes</h1>

    </div>

        <div className="cat-icons">
            <img src={pizza} alt="Home" className="image-icon"/>
            <h1 className="icons-title">Pizza</h1>

        </div>



    </div>
  );
};
export default BrowseCategoriesIcons;
