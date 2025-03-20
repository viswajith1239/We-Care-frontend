


import { createAsyncThunk } from '@reduxjs/toolkit';

import { User } from "../features/userTyepes";
import userService from "../service/userService"




interface RegisterErrorPayload {
  status: number;
  message: string;
}
export const registerForm = createAsyncThunk<
any, 
  User, 
  { rejectValue: RegisterErrorPayload } 
>(
  "/signup",
  async (userData: User, thunkAPI) => {
    console.log("ith ethi");
    
    try {
      const response = await userService.registerForm(userData);
      console.log("the responseis",response)
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        console.log("Email already exists", error.response);
        return thunkAPI.rejectWithValue({ status: 409, message: 'Email already exists' });
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

interface VerifyOtpArgs {
  userData: User; 
  otp: string;
}

export const verifyOtp = createAsyncThunk(
  "/verifyotp",
  async ({ userData, otp }: VerifyOtpArgs, thunkAPI) => {
    console.log("yes in front end",otp)
    try {
      const response = await userService.verifyOtp({ userData, otp });
      console.log("check response in frnt",response)
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const verifyForgotOtp=createAsyncThunk(
  "user/otp",
  async({userData,otp}:VerifyOtpArgs,thunkAPI)=>{

      try {
        
          const response=await userService.verifyForgotOtp({userData,otp})
          console.log("yess")
          console.log("response is----",response)
          return response
      } catch (error:any) {
        console.log("response----",error)
          return thunkAPI.rejectWithValue(error.response.data)
          
      }
  }

)

interface loginUser {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk(
  '/login',
  async ({ email, password }: loginUser, thunkAPI) => {
    try {
      const response = await userService.login({ email, password });
      console.log('User login response data:', response.data);
      return response.data;
    } catch (error: any) {
      console.error("Entered into error handling:", error); 

      return thunkAPI.rejectWithValue(error);
    }
  }
);



export const GoogleLogins = createAsyncThunk<User | null, string, { rejectValue: string }>(
  "user/googlesignup",
  async (token, thunkAPI) => {
    try {
      const response = await userService.googleAuth(token);
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "An unknown error occurred");
    }
  }
);
