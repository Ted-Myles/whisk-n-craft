import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import "../components/browse-categories/browse-categoriesIcons.css";
import bread from "../assets/images/bread.jpg";
import cookies from "../assets/images/cookies.jpg";
import cake from "../assets/images/cake.jpg";
import cupcake from "../assets/images/cupcake.jpg";
import pizza from "../assets/images/pizza.jpg";

const categories = [
    { title: "Cake", image: cake },
    { title: "Bread", image: bread },
    { title: "Cookies", image: cookies },
    { title: "Cupcakes", image: cupcake },
    { title: "Pizza", image: pizza },
];

const BrowseCategoriesIcons = (): ReactElement => {
    return (
        <div className="categories-icons">
            {categories.map(({ title, image }) => (
                <Link to={`/category/${title.toLowerCase()}`} className="cat-icons" key={title}>
                    <img src={image} alt={title} className="image-icon" />
                    <h1 className="icons-title">{title}</h1>
                </Link>
            ))}
        </div>
    );
};

export default BrowseCategoriesIcons;