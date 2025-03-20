
import {useEffect,useRef,useState} from 'react'
import logo_img from "../../assets/wecare logo.png"
import { Link,useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import profileicon from "../../assets/user.png"


function Header() {
  
  const navigate=useNavigate()

 
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null); 


 
  function handleLogout() {
    Cookies.remove("AccessToken");
    navigate("/login");
  }

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false); 
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-[#5cbba8] text-[#572c5f] p-4 sticky top-0 z-50">
  <div className="container mx-auto flex justify-between items-center">
    
  <div className="text-lg font-semibold h-16 flex items-center">
  <img 
    src={logo_img} 
    alt="Logo" 
    className="w-12 h-12 rounded-full object-cover" 
  />
</div>


    
    <nav className="hidden md:flex space-x-8">
    <h1 className="text-1xl font-bold text-white">
  <a href="/" className="hover:text-yellow-400 transition">
    Home
  </a>
     </h1>
 <h1 className="text-1xl font-bold text-white">
  <a href="/doctors" className="hover:text-yellow-400 transition">
    Doctors
  </a>
     </h1>
     <h1 className="text-1xl font-bold text-white">
  <a href="#" className="hover:text-yellow-400 transition">
    About
  </a>
     </h1>
     <h1 className="text-1xl font-bold text-white">
  <a href="#" className="hover:text-yellow-400 transition">
    Contact
  </a>
     </h1>
    </nav>

    
    <div className="hidden md:flex space-x-4">
     
     

      <div className="relative" ref={profileMenuRef}>
          <img
            alt="user profile"
            src={profileicon}
            className="h-7 w-7 cursor-pointer rounded-full object-cover"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          />
          {isProfileMenuOpen && (
            <ul
              role="menu"
              className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white text-gray-800"
            >
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link to="/profile">My Profile</Link>
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          )}
        </div>
    </div>

  
    <div className="md:hidden flex items-center space-x-4">
      <button className="text-white" id="hamburger-menu">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </div>

  
  <div id="mobile-menu" className="md:hidden hidden bg-gray-800 text-white p-4">
    <a href="#" className="block py-2 hover:text-yellow-400">Home</a>
    <a href="#" className="block py-2 hover:text-yellow-400">About</a>
    <a href="#" className="block py-2 hover:text-yellow-400">Services</a>
    <a href="#" className="block py-2 hover:text-yellow-400">Contact</a>
  </div>
</header>

  )
}

export default Header