
// import React from "react"
import Header from "../../components/userComponents/Header"
import Banner from "../../components/userComponents/Banner"
import Footer from "../../components/userComponents/Footer"
// import userAxiosInstance from "../../axios/userAxiosInstance";
// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// import API_URL from "../../axios/API_URL";
function HomePage(){

    // const navigate = useNavigate();
    // useEffect(() => {
    //     console.log("function kkkk");
        
    //     const checkUserStatus = async (userId: string) => {
    //       console.log("function keri");
    //       console.log("");
          
    //       try {
    //         const response = await userAxiosInstance.get(`${API_URL}/user/status?userId=${userId}`)// Call user status API
    //         console.log("User status response:", response.data);
    //         console.log("hhh",response)
    //         if (response.data.isBlocked) {
    //           navigate("/login"); // Redirect if blocked
    //         }
    //       } catch (error) {
    //         console.error("Error fetching user status:", error);
    //       }
    //     };
    
    //     checkUserStatus();
    //     const interval = setInterval(checkUserStatus, 10000); // Check every 10 seconds
    
    //     return () => clearInterval(interval); // Cleanup interval on unmount
    //   }, [navigate]);
    return(
        <div>
            <Header/>
            <Banner/>
            <Footer/>
        </div>
    )
}
export default HomePage