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
    
    
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

const login = async (userData: { email: string; password: string }) => {
  try {
    const response = await userAxiosInstance.post(`${API_URL}/user/login`, userData);
    return response; 
  } catch (error: any) {
    console.error("Axios error response:", error.response); // Debugging log

    if (error.response) {
      return Promise.reject(error.response.data); // Return actual backend response
    }

    return Promise.reject({ message: "An unknown error occurred" });
  }
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

const forgotPassword=async(emailData:string)=>{
  try {
      console.log("email is",emailData)
       const response=await userAxiosInstance.post(`${API_URL}/user/forgotpassword`,{emailData})
       console.log("the response from forgotpswd",response)
       return response.data
  } catch (error) {
      console.log("Forgot Password Error",error)
  }

}


const verifyForgotOtp=async({ userData, otp,}:{userData:User;otp:string})=>{

  try{

   const response=await axios.post(`${API_URL}/user/forgototp`,{userData,otp})
   
   console.log("the frontend response otp",response)
   if(response.data){
       localStorage.setItem("user",JSON.stringify(response.data))
   }
   return response.data
  }catch(error:any){
      const errormessage=error.response?.data?.message
      console.log(error)
      throw new Error(errormessage);

  }

}

const resetPassword=async( userData: string, payload: { newPassword: string })=>{
  try {
   console.log("Email in request:", userData);
   console.log("Password payload:", payload);
   const response=await userAxiosInstance.post(`${API_URL}/user/resetpassword`, { userData, payload });
   console.log("Frontend response:", response);
   return response.data;
  } catch (error) {
    console.error("Error in ResetPassword:", error);
  }
}




const userService = {
    registerForm,
    verifyOtp,
    login,
    googleAuth,
    forgotPassword,
    verifyForgotOtp,
    resetPassword
    
  };

  export default userService;