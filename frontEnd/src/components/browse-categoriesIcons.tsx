import type { ReactElement } from "react";
import "../components/browse-categories/browse-categoriesIcons.css";
import bread from "../assets/icons/bread.png";
import cake from "../assets/icons/cake.png";

const BrowseCategoriesIcons = (): ReactElement => {
  return (
    <div className="categories-icons">
      <div className="cat-icons" color="blue">
        <img src={cake} alt="Home" className="bake2" />
        Cakes
      </div>

      <div className="cat-icons">
        <img src={bread} alt="Home" className="bake2"/>
        Bread
      </div>
    </div>
  );
};
export default BrowseCategoriesIcons;
