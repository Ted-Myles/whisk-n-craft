import { Routes, Route, Navigate } from "react-router-dom";
import { Loader } from 'lucide-react';
import "../src/App.css"

import HomePage from './pages/home.page';
import { useEffect } from 'react';
import Header from "./components/header";

const App = () => {

  
    return (
    <div >
        
         
        <Routes>
        {/* <Header/> */}
        <Route path="/" element={<HomePage />} />

        </Routes>

</div>
  )
}

export default App