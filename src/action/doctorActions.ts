import { createAsyncThunk } from "@reduxjs/toolkit";
import doctorservice from "../service/doctorService"


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
          return   thunkAPI.rejectWithValue(error.response.data)
        }
    }
  )