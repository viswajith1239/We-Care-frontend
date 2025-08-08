
import { createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "../service/adminService"

interface LoginAdmin {
    email: string;
    password: string;
  }


 
  
  export const adminLogin = createAsyncThunk(
    "admin/login",
    async ({ email, password }: LoginAdmin, thunkAPI) => {
      try {
        const response = await adminService.loginAdmin({ email, password });
        console.log("response admin",response);
        console.log("response status",response.status);
        
  
        
        console.log("evide ethi");
        
        if (response.status === 200) {
          console.log("res",response.status);
          console.log("resssssssssss",response.data );
          return { status: response.status, data: response.data };
          
          
        } else {
          return thunkAPI.rejectWithValue("Invalid credentials");
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "An error occurred. Please try again.";
        return thunkAPI.rejectWithValue(errorMessage);
      }
    }
  );

  export const adminLogout = createAsyncThunk(
  "admin/logout",
  async (_, thunkAPI) => {
    try {
      const response = await adminService.adminLogout();
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to logout");
    }
  }
);
  