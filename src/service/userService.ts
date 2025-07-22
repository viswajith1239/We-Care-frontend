import { User } from "../features/userTyepes";
import API_URL from '../axios/API_URL'; 
import userAxiosInstance from "../axios/userAxiosInstance";
import axios from "axios";
import { Doctor } from "../types/doctor";

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
    console.error("Axios error response:", error.response); 

    if (error.response) {
      return Promise.reject(error.response.data); 
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

const logout = () => {
  return userAxiosInstance.post(`${API_URL}/user/logout`, {});
}


export const getspecializations=()=>{
 return userAxiosInstance.get(`${API_URL}/user/specializations`);
}

export const getusers=()=>{
  return  userAxiosInstance.get(`${API_URL}/user/users/`); 
}

export const getuser=(userId:string)=>{
  return  userAxiosInstance.get(`${API_URL}/user/users/${userId}`); 
}

export const getnotification=(userId:string)=>{
  return  userAxiosInstance.get(`${API_URL}/user/notifications/${userId}`); 
}

export const clearnotification=(userId:string)=>{
  return  userAxiosInstance.delete(`${API_URL}/user/clear-notifications/${userId}`); 
}

export const getdoctors=()=>{
  return userAxiosInstance.get(`${API_URL}/user/doctors`);
}

export const getreports=(userId:string)=>{
  return userAxiosInstance.get(`${API_URL}/user/reports/${userId}`);
}


export const fetchdoctors=()=>{
  return userAxiosInstance.get<Doctor[]>(`${API_URL}/user/doctors`);
}

export const getdoctor=(doctorId:string)=>{
  return userAxiosInstance.get(`${API_URL}/user/doctors/${doctorId}`);
}

export const getschedules=()=>{
return userAxiosInstance.get(`${API_URL}/user/schedules`)
}

export const getDoctorReview=(doctorId:string)=>{
return userAxiosInstance.get(`${API_URL}/user/reviews/${doctorId}`)
}


export const createStripeSession = async (appointmentId: string, userData: any) => {
  const response = await userAxiosInstance.post(
    `${API_URL}/user/payment/${appointmentId}`,
    { userData }
  );
  return response;
};





export const getBookingDetails = (
  userId: string,
  page: number = 1,
  limit: number = 5
) => {
  return userAxiosInstance.get(
    `${API_URL}/user/bookings-details/${userId}?page=${page}&limit=${limit}`
  );
};

export const getPrescription = (
  userId: string,
  page: number = 1,
  limit: number = 5
) => {
  return userAxiosInstance.get(
    `${API_URL}/user/prescription/${userId}?page=${page}&limit=${limit}`
  );
};

export const getWalletData = async (userId: string, page: number, limit: number) => {
  return userAxiosInstance.get(
    `${API_URL}/user/wallet-data/${userId}?page=${page}&limit=${limit}`
  );
  
};
export const cancelAppointment = async (
  appoinmentId: string,
  userId: string,
  doctorId: string
) => {
  return userAxiosInstance.post(`${API_URL}/user/cancel-appoinment`, {
    appoinmentId: appoinmentId,
    userId,
    doctorId,
  });
}


export const submitContactFormApi = async (
  userId: string,
  formData: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }
) => {
  const response = await userAxiosInstance.post(
    `${API_URL}/user/contact/${userId}`,
    {
      ...formData,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    }
  );
  return response.data;
};




const userService = {
    registerForm,
    verifyOtp,
    login,
    googleAuth,
    forgotPassword,
    verifyForgotOtp,
    resetPassword,
    logout
    
  };

  export default userService;