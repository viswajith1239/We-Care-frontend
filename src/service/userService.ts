import { User } from "../features/userTyepes";
import API_URL from '../axios/API_URL'; 
import userAxiosInstance from "../axios/userAxiosInstance";
import axios from "axios";

const registerForm = async (userData: User) => {

  const response = await userAxiosInstance.post(`${API_URL}/user/signUp`, userData);

  if (response.data) {
    console.log('registerForm', response.data);
  }

  return response.data;
};

const verifyOtp = async ({
  
  
  userData,
  otp,
}: {
  userData: User;
  otp: string;
}) => {
  console.log("route for backend");
  
  const response = await userAxiosInstance.post(`${API_URL}/user/verifyotp`, { userData, otp });
  console.log("userdata",userData);
  

  if (response.data) {
    console.log("verifyotpsssss",response.data);
    
    // Store the user data in localStorage after successful OTP verification
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

const login = async (userData: { email: string; password: string }) => {
  const response = await userAxiosInstance.post(`${API_URL}/user/login`, userData);
  return response;
};


const googleAuth=async(token:string)=>{
  try {
     
      const response=await axios.post(`${API_URL}/user/googlesignup`,{token},{
          headers: { "Content-Type": "application/json" },
      })
      
      return response
  } catch (error:any) {
         const errormessage=error.response?.data?.message|| " token failed.."
         console.log(error)
         throw new Error(errormessage);
  }
}

const userService = {
    registerForm,
    verifyOtp,
    login,
    googleAuth
    
  };

  export default userService;