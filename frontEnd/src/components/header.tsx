import Banner from '../components/banner';
import Navbar from '../components/navbar';
import "../components/styles/header.css";
import { RemoveScroll } from 'react-remove-scroll';

const Header = () => {
  return (
   
    <div className="header">
        <Navbar/>
        
    </div>
   
  );
}
export default Header;