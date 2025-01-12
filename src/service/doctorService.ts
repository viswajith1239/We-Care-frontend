
import axios from "axios"
import API_URL from "../axios/API_URL"
import doctorAxiosInstance from "../axios/doctorAxiosInstance"
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
      
      // Store the user data in localStorage after successful OTP verification
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


  const doctorService={
    registerDoctor,
    verifyOtp,
    loginDoctor,
    
  }
  export default doctorService;