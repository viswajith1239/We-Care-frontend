
import axios from "axios"
import API_URL from "../axios/API_URL"
import doctorAxiosInstance from "../axios/doctorAxiosInstance"
import { Doctor } from "../types/doctor";
export interface IDoctor {
    doctorId?: string;
    name: string;
    phone: string;
    email: string;
    password: string;
    isBlocked?: boolean;
  }

const registerDoctor = async (doctorData: IDoctor) => {
    try {
        const response=await axios.post(`${API_URL}/doctor/signup`,doctorData)
        if (response.data) {
          console.log('doctor registerForm', response.data);
        }
      
        return response.data;

    } catch (error) {
        
    }
  }

  const verifyOtp = async ({
  
  
    doctorData,
    otp,
  }: {
    doctorData: any;
    otp: string;
  }) => {
    console.log("route for backend");
    
    const response = await axios.post(`${API_URL}/doctor/verifyotp`, { doctorData, otp });
    console.log("userdata",doctorData);
    
  
    if (response.data) {
      console.log("verifyotpsssss",response.data);
      
    
      localStorage.setItem("doctor", JSON.stringify(response.data));
    }
  
    return response.data;
  }


    const loginDoctor=async({email,password}:{email:string,password:string})=>{     
         
      try {
        console.log("doctor service..",email,password)
          const response=await doctorAxiosInstance.post(`${API_URL}/doctor/logindoctor`,{email,password})
  
          // const accessToken  = response.data.token
          // console.log("accessss token is",accessToken)
  
          localStorage.setItem("accesstoken", response.data.token);
          return response.data
          
      } catch (error:any) {
          const errormessage=error.response?.data?.message|| "login failed.."
          console.log(error)
          throw new Error(errormessage);
      }
  
  
  }

  const kycSubmission = async (formData: FormData) => {
      console.log("in subbbbb");
      
    try {
      console.log("in try");
      
      const response = await doctorAxiosInstance.post(`${API_URL}/doctor/kyc`, formData, {
        
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("yes............response data is",response.data)
      return response.data;
    } catch (error: any) {
      console.error(
        "Error kyc submission doctor:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  const googleAuth=async(token:string)=>{
    try {
       
        const response=await axios.post(`${API_URL}/doctor/googlesignup`,{token},{
            headers: { "Content-Type": "application/json" },
        })
        
        return response
    } catch (error:any) {
           const errormessage=error.response?.data?.message|| " token failed.."
           console.log(error)
           throw new Error(errormessage);
    }
  }

  const kycStatus = async (doctor_id: string) => {
    console.log("request gone from servicefront")
    try {
      const response = await doctorAxiosInstance.get(`${API_URL}/doctor/kycStatus/${doctor_id}`);
      console.log("******service submickyc*******",response.data)
      return response.data;
    } catch (error: any) {
      console.error(
        "Error during KYC status fetching:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  const logoutDoctor = async () => {
    try {
      const response = await doctorAxiosInstance.post(`${API_URL}/doctor/logout`);
      return response.data;
    } catch (error: any) {
      console.error(
        "Error during doctor logout:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  const forgotPassword=async(emailData:string)=>{
    try {
        console.log("email is",emailData)
         const response=await doctorAxiosInstance.post(`${API_URL}/doctor/forgotpassword`,{emailData})
         console.log("the response from forgotpswd",response)
         return response.data
    } catch (error) {
        console.log("Forgot Password Error",error)
    }
  }

    const verifyForgotOtp=async({ doctorData, otp,}:{doctorData:Doctor;otp:string})=>{
    
      try{
    
       const response=await axios.post(`${API_URL}/doctor/forgototp`,{doctorData,otp})
       
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
  
    const resetPassword=async( doctorData: string, payload: { newPassword: string })=>{
      try {
       console.log("Email in request:", doctorData);
       console.log("Password payload:", payload);
       const response=await doctorAxiosInstance.post(`${API_URL}/doctor/resetpassword`, { doctorData, payload });
       console.log("Frontend response:", response);
       return response.data;
      } catch (error) {
        console.error("Error in ResetPassword:", error);
      }
    }
  
  


  const doctorService={
    registerDoctor,
    verifyOtp,
    loginDoctor,
    kycSubmission,
    kycStatus,
    googleAuth,
    forgotPassword,
    logoutDoctor,
    verifyForgotOtp,
    resetPassword
    
  }
  export default doctorService;