import { createAsyncThunk } from "@reduxjs/toolkit";
import doctorservice from "../service/doctorService"
import doctorService from "../service/doctorService";


export interface IDoctor {
    doctorId?: string;
    name: string;
    phone: string;
    email: string;
    password: string;
    isBlocked?: boolean;
  }

export const registerDoctor = createAsyncThunk(
    'doctor/signup',
    async (doctorData: IDoctor, thunkAPI) => {
      try {
        const response = await doctorservice.registerDoctor(doctorData);
        return response.data
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'An error occurred';
        return thunkAPI.rejectWithValue(errorMessage);
      }
    }
  );

  interface VerifyOtpArgs {
    doctorData: any; 
    otp: string;
  }
  
  export const verifyOtp = createAsyncThunk(
    "doctor/otp",
    async ({ doctorData, otp }: VerifyOtpArgs, thunkAPI) => {
      console.log("yes in front end",otp)
      try {
        const response = await doctorservice.verifyOtp({ doctorData, otp });
        console.log("check response in frnt",response)
        return response;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
    }
  );

  export const verifyForgotOtp=createAsyncThunk(
    "doctor/otp",
    async({doctorData,otp}:VerifyOtpArgs,thunkAPI)=>{
  
        try {
          
            const response=await doctorservice.verifyForgotOtp({doctorData,otp})
            console.log("yess")
            console.log("response is----",response)
            return response
        } catch (error:any) {
          console.log("response----",error)
            return thunkAPI.rejectWithValue(error.response.data)
            
        }
    }
  
  )

  interface LoginDoctorArgs{
    email:string,
    password:string
}

  export const loginDoctor=createAsyncThunk(
  
    "doctor/login",
    async({email,password}:LoginDoctorArgs,thunkAPI)=>{
  
        try {
            const response=await doctorservice.loginDoctor({email,password}) 
            
            return response
  
        } catch (error:any) {
          const message = error.response?.data?.message || error.message || 'Login failed';
          return   thunkAPI.rejectWithValue({message})
        }
    }
  )

  export const GoogleLogins = createAsyncThunk<IDoctor | null, string, { rejectValue: string }>(
    "doctor/googlesignup",
    async (token, thunkAPI) => {
      try {
        const response = await doctorservice.googleAuth(token);
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message || "An unknown error occurred");
      }
    }
  );

  export const submitKyc = createAsyncThunk(
    'doctor/kyc', 
    async ({ formData }: { formData: FormData }, thunkAPI) => {  // Accept FormData here
      console.log("FormData check:", Array.from(formData.entries()));
      try {
        console.log("kycccccccccccccc");
        
        const response = await doctorservice.kycSubmission(formData); // Pass FormData
        console.log('response in submitkyc in action ', response);
        return response;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
    }
  );

  export const getKycStatus = createAsyncThunk(
    'doctor/kycStatus',
    async (doctor_id: string, thunkAPI) => {
     try {
      console.log("yes request gone.......")
  
      const response = await doctorservice.kycStatus(doctor_id)
      
       console.log("kyc status response action",response);
      
      return response
      
     } catch (error : any) {
      return thunkAPI.rejectWithValue(error.response)
      
     }
    }
    
  
  )

  export const logoutDoctor = createAsyncThunk(
    'doctor/logout',
    async (_, thunkAPI) => {
      try {
        const response = await doctorService.logoutDoctor()    
        return response  
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response)
      }
    }
  )