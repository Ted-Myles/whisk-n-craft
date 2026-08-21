import React from "react";
import type { ReactElement } from "react";
import BrowseCategories from "../components/browse-categoriesTitle";
import Header from "../components/header";
import "../pages/styles/homepage.css";
import Banner from "../components/banner";
import BrowseCategoriesIcons from "../components/browse-categoriesIcons";
import FeaturedRecipes from "../components/featuredContainer";

const HomePage = () => {
  return (
    <div className="homepage-container">
      <Header />
      <div className="homepage-body">
        <Banner />
        <BrowseCategories />
        <BrowseCategoriesIcons />
        <FeaturedRecipes />

      </div>
    </div>
  );
};

export default HomePage;
