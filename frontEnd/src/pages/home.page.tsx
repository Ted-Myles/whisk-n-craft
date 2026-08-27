import React from "react";
import type { ReactElement } from "react";
import BrowseCategories from "../components/browse-categoriesTitle";
import Header from "../components/header";
import "../pages/styles/homepage.css";
import Banner from "../components/banner";
import BrowseCategoriesIcons from "../components/browse-categoriesIcons";
import FeaturedRecipes from "../components/featuredContainer";
import Navbar from "../components/navbar";

const HomePage = () => {
  return (
    <div className="homepage-container">
      <Header />
        <Navbar />

      <div className="homepage-body">
        {/*<Banner />*/}

        <FeaturedRecipes />
          <BrowseCategories />
          <BrowseCategoriesIcons />
      </div>
    </div>
  );
};

export default HomePage;
