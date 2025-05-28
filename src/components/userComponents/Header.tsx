
import {useEffect,useRef,useState} from 'react'
import logo_img from "../../assets/wmremove-transformed.png"
import { Link,useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import profileicon from "../../assets/user.png"
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import userAxiosInstance from '../../axios/userAxiosInstance';
import API_URL from '../../axios/API_URL';
import toast from 'react-hot-toast';
import { useNotification } from "../../context/NotificationContext";
import { BsBell } from 'react-icons/bs';


interface INotificationContent {
  content: string;
  bookingId: string;
  read: boolean;
}

export interface INotification {
  _id?: string;
  receiverId?: string;
  notifications?: INotificationContent[];
  createdAt?: string;
  updatedAt?: string;
}

function Header() {
  
  const navigate=useNavigate()

 
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null); 
  const {addUserNotification,clearUserNotifications, userNotifications, updateUserNotificationReadStatus, countUnreadNotificationsUser} = useNotification();
  const [isNotificationOpen,setIsNotificationOpen]=useState(false)
  const[notificationsData,setNotificationsData]=useState()
  const { userInfo } = useSelector((state: RootState) => state.user);

 
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


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await userAxiosInstance.get(
          `${API_URL}/user/notifications/${userInfo?.id}`
        );
        const serverNotifications = response.data?.notifications ?? [];
        serverNotifications.forEach((notif: any) => {
          if (notif && notif.content) {
            addUserNotification(notif.content);
          }
        });
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchNotifications();
  }, [userInfo?.id]);

  const handleClear = async () => {
    try {
      const response = await userAxiosInstance.delete(
        `${API_URL}/user/clear-notifications/${userInfo?.id}`
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        clearUserNotifications();
      } else {
        console.error("Failed to clear notifications. Please try again.");
      }
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  return (
    <header className="bg-[#5cbba8] text-[#572c5f] p-4 sticky top-0 z-50">
  <div className="container mx-auto flex justify-between items-center">
    
  <div className="text-lg font-semibold h-16 flex items-center">
  <img 
    src={logo_img} 
    alt="Logo" 
    className="w-28 h-12 rounded-full object-cover" 
  />
</div>


    
    <nav className="hidden md:flex space-x-8">
    <h1 className="text-1xl font-bold text-white">
    <Link to="/" className="hover:text-yellow-400 transition">
    Home
  </Link>
     </h1>
 <h1 className="text-1xl font-bold text-white">
 <Link to="/doctors" className="hover:text-yellow-400 transition">
  Doctors
</Link>
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

    
    <div className="hidden md:flex items-center space-x-4">


<div className="relative">
  <BsBell 
    className="h-6 w-6 text-[#572c5f] cursor-pointer" 
    onClick={() => setIsNotificationOpen(!isNotificationOpen)} 
  />
  <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold text-white bg-red-600 rounded-full flex items-center justify-center">
    {countUnreadNotificationsUser}
  </span>

 
  {isNotificationOpen && (
    <div className="absolute right-0 mt-2 w-[320px] bg-white shadow-lg rounded-md p-4 z-50">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
        Notifications
      </h3>
      {userNotifications?.length ? (
        <>
          <ul className="space-y-3 mt-2 max-h-64 overflow-y-auto">
            {userNotifications.map((notification, index) => (
              <li
                key={index}
                className={`text-sm text-gray-700 border-b pb-2 cursor-pointer ${
                  notification.read ? "opacity-50 bg-gray-100" : "bg-[#dce1d9]"
                }`}
              >
                {typeof notification.message === "string"
                  ? notification.message
                  : "Invalid message"}
              </li>
            ))}
          </ul>
          <div onClick={handleClear} className="flex justify-end mt-2">
            <button className="text-sm text-gray-800 hover:underline">
              Clear
            </button>
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-500 mt-2">No new notifications</p>
      )}
    </div>
  )}
</div>

     
     

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