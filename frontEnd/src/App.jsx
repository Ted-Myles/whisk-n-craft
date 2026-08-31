// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home.page';           // wherever FeaturedRecipes currently lives
import RecipeDetailRoute from './pages/direction.page/RecipeDetail.tsx';
import Authentication from "./pages/authentication/signup.login.tsx";
import CategoryPage from './pages/categories/categoryPage';

export default function App() {
    return (

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/recipes/:id" element={<RecipeDetailRoute />} />
                <Route path="/login-signup" element={<Authentication />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />

            </Routes>

    );
}