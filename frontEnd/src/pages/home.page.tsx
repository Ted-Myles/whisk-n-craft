import React from "react";
import type { ReactElement } from "react";
import BrowseCategories from "../components/browse-categories";
import Header from "../components/header";
import "../pages/styles/homepage.css";
import Banner from "../components/banner";

const HomePage = () => {
  return (
    <div className="homepage-container">
      <Header />
      <div className="homepage-body">
        <Banner />
        <BrowseCategories />
      </div>
    </div>
  );
};

export default HomePage;
