
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

    export const getDoctorBookings=(doctorId:string)=>{
      return doctorAxiosInstance.get( `${API_URL}/doctor/bookings/${doctorId}` )
    }

     export const getBookingDetails=(doctorId:string)=>{
      return doctorAxiosInstance.get( `${API_URL}/doctor/bookingdetails/${doctorId}` )
    }

      export const getWalletBalance=(doctorId:string)=>{
      return doctorAxiosInstance.get( `${API_URL}/doctor/wallet-data/${doctorId}` )
    }
     export const getDoctorDashboardData=(doctorId:string)=>{
      return doctorAxiosInstance.get( `${API_URL}/doctor/dashboard/${doctorId}` )
    }

     export const getDoctorNotification=(doctorId:string)=>{
      return doctorAxiosInstance.get( `${API_URL}/doctor/notifications/${doctorId}` )
    }

     export const clearDoctorNotification=(doctorId:string)=>{
      return doctorAxiosInstance.delete( `${API_URL}/doctor/clear-notifications/${doctorId}` )
    }

    export const getPrescriptions=(doctorId:string)=>{
      return doctorAxiosInstance.get( `${API_URL}/doctor/prescriptions/${doctorId}` )
    }

    export const getDoctor=(doctorId:string)=>{
      return doctorAxiosInstance.get( `${API_URL}/doctor/${doctorId}` )
    }

     export const kyc=(doctorId:string)=>{
      return doctorAxiosInstance.put( `${API_URL}/doctor/kyc/resubmit/${doctorId}` )
    }

     export const kycRejection=(doctorId:string)=>{
      return doctorAxiosInstance.put( `${API_URL}/doctor/rejection-reason/${doctorId}` )
    }
    export const getSpecialization=()=>{
      return doctorAxiosInstance.get( `${API_URL}/doctor/specializations` )
    }

     export const getDoctorSpecialization=(doctorId:string)=>{
      return doctorAxiosInstance.get( `${API_URL}/doctor/specializations/${doctorId}` )
    }

    export const getreports=(doctorId:string)=>{
      return doctorAxiosInstance.get( `${API_URL}/doctor/reports/${doctorId}` )
    }


    export const updateDoctorProfile = async (doctorId: string, updatedData: FormData) => {
  return doctorAxiosInstance.patch(
    `${API_URL}/doctor/update-doctor/${doctorId}`,
    updatedData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const resendOtpdoctor = async (email: string) => {
  const response = await axios.post(`${API_URL}/doctor/resend-otp`, {
    email,
  });
  return response;
};

export const getWalletData = async (doctorId: string, page: number, limit: number) => {
  return doctorAxiosInstance.get(
    `${API_URL}/doctor/wallet-data/${doctorId}?page=${page}&limit=${limit}`
  );
  
};

export const getSessionData = async (doctorId: string, page: number, limit: number) => {
  return doctorAxiosInstance.get(
    `${API_URL}/doctor/shedules/${doctorId}?page=${page}&limit=${limit}`
  );
  
};

export const withdrawMoneydoctor = async (doctorId: string, amount: number) => {
  const response = await doctorAxiosInstance.post(`${API_URL}/doctor/withdraw/${doctorId}`, {
    amount,
  });
  return response;
};
  


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