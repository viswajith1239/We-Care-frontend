import React from 'react'
import logo_img from "../../assets/wecare logo.png"
import { useNavigate } from 'react-router-dom';


function Header() {
  
  const navigate=useNavigate()

  function goToSignUp(event:React. MouseEvent<HTMLButtonElement>): void {
    navigate("/signup")
    throw new Error('Function not implemented.');
  }
  function goToLogin(event:React. MouseEvent<HTMLButtonElement>): void {
    navigate("/login")
    throw new Error('Function not implemented.');
  }


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
  <a href="#" className="hover:text-yellow-400 transition">
    Home
  </a>
     </h1>


     <h1 className="text-1xl font-bold text-white">
  <a href="#" className="hover:text-yellow-400 transition">
    About
  </a>
     </h1>
     <h1 className="text-1xl font-bold text-white">
  <a href="#" className="hover:text-yellow-400 transition">
    Doctors
  </a>
     </h1>
     <h1 className="text-1xl font-bold text-white">
  <a href="#" className="hover:text-yellow-400 transition">
    Contact
  </a>
     </h1>
    </nav>

    
    <div className="hidden md:flex space-x-4">
     
      <button
        onClick={goToSignUp}
        className="text-white bg-[#1F2937]  font-medium rounded-lg text-lg leading-8 px-8 py-3 cursor-pointer text-center mr-2 inline-flex items-center hover:bg-[#1F2937] "
      >
        Signup
      </button>
      <button onClick={goToLogin}
       className="bg-[#1F2937] text-white py-2 px-4 font-medium rounded-lg hover:bg-[#1F2937] transition">
        Logout
      </button>
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