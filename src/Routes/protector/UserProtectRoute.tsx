// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ReactNode } from "react";
// import Cookies from "js-cookie";
// interface UserProtectRouteProps {
//     children: ReactNode; 
//   }

// const UserProtectRoute = ({children}:UserProtectRouteProps)=>{
// const navigate=useNavigate()
// const userToken=Cookies.get("AccessToken")
// console.log("token",userToken);


// useEffect(()=>{
//     if(!userToken){
//         navigate("/login",{replace:true})
//     }
// },[userToken,navigate])
// if (userToken) {
//     return children; 
//   }
//   return null
//  }

// export default UserProtectRoute

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store"; // Adjust the import path to your Redux store

interface UserProtectRouteProps {
  children: ReactNode;
}

const UserProtectRoute = ({ children }: UserProtectRouteProps) => {
  const navigate = useNavigate();
  
  // Get userInfo from Redux store instead of cookies
  const { userInfo } = useSelector((state: RootState) => state.user);
  
  useEffect(() => {
    // Redirect to login if userInfo doesn't exist
    if (!userInfo) {
      navigate("/login", { replace: true });
    }
  }, [userInfo, navigate]);
  
  // Return children only if userInfo exists
  if (userInfo) {
    return children;
  }
  
  return null;
};

export default UserProtectRoute;