import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import logo_img from "../../assets/wmremove-transformed.png"

const Footer = () => {
  return (
    <footer className="bg-[#5cbba8] text-white rounded-t-3xl p-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        <div className="flex flex-col items-center md:items-start">
          <div className="text-lg font-semibold h-16 flex items-center">
            <img
              src={logo_img}
              alt="Logo"
              className="w-28 h-12 rounded-full object-cover"
            />
            <h1 className="ml-4 font-bold text-xl"></h1>
          </div>
          <p className="text-center md:text-left text-sm mt-4">
            A team of compassionate specialists dedicated to your health and well-being in fields like orthopedics, cardiology, and pediatrics.
          </p>
        </div>


        <div>
          <h3 className="font-semibold text-2xl mb-4 text-center md:text-left">Quick Links</h3>
          <ul className="space-y-2 text-center md:text-left">
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/services" className="hover:underline">Services</a></li>
            <li><a href="/doctors" className="hover:underline">Doctors</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>


        <div>
          <h3 className="font-semibold mb-4 text-2xl   text-center md:text-left">Services</h3>
          <ul className="space-y-2 text-center md:text-left">
            <li><a href="/lab-test" className="hover:underline">Lab Test</a></li>
            <li><a href="/health-check" className="hover:underline">Health Check</a></li>
            <li><a href="/heart-health" className="hover:underline">Heart Health</a></li>
          </ul>
        </div>


        <div>
          <h3 className="font-semibold mb-4 text-2xl  text-center md:text-left">Contact Us</h3>
          <nav className="flex flex-col gap-2 text-center md:text-left">
            <p>123 Wmg Street, Suite 456, Springfield, IL 62701</p>
            <p>support@care.com</p>
            <p>+123-456-7890</p>
          </nav>
        </div>
      </div>


      <div className="text-center mt-8">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} WeCare. Developed by
          <span className="text-hoverColor"> Champion Programmers</span>. All rights reserved.
        </p>
        <div className="flex justify-center space-x-6 mt-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="text-white text-2xl hover:text-[#f5a623]" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-white text-2xl hover:text-[#f5a623]" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-white text-2xl hover:text-[#f5a623]" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-white text-2xl hover:text-[#f5a623]" />
          </a>
        </div>
      </div>
    </footer>

  );
};

export default Footer;
