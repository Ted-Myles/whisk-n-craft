import type { ReactElement } from "react";
import "../components/browse-categories/browse-categoriesIcons.css"
import bread from "../assets/icons/bread.png"

const BrowseCategoriesIcons = (): ReactElement => {
  return (
     <div className="categories-icons">
         <div className="btn">
                 <img src={bread} alt="Home" className="bake1" />
                 Bread
               </div>
     </div>
  );
};
export default BrowseCategoriesIcons;