import type { ReactElement } from "react";
import "../components/browse-categories/browse-categoriesTitle.css";
import breadIcon from "../assets/icons/bake1.png";

const BrowseCategories = (): ReactElement => {
  return (
    <div className="browse-categories">
      <div className="entry-header">
        {/* Render GIF above the title */}
        <img src={breadIcon} alt="Bread animation" className="bread-gif" />
        <h1 className="entry-title">Browse Categories</h1>
        <img src={breadIcon} alt="Bread animation" className="bread-gif"/>
      </div>
      
      
    </div>
  );
};

export default BrowseCategories;
