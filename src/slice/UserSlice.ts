// 




import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState, User } from "../features/userTyepes";
import {registerForm,verifyOtp,loginUser } from "../action/userActions";

// Initial state
const user = localStorage.getItem("user");

const final = user ? JSON.parse(user) : null;

const initialState: UserState = {
  userInfo: final?final : null,
  token: localStorage.getItem("access_token") || null,
  loading: false,
  error: null,

  
};

// User slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser(state) {
      state.userInfo = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    
    
  },
  extraReducers: (builder) => {
    builder
      // Register user actions
      .addCase(registerForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerForm.fulfilled, (state, action: PayloadAction<User>) => {
        
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(registerForm.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
        //verifyotp actions
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      //login user actions
      .addCase(loginUser.pending, (state, action: PayloadAction<any>) => {
        state.loading = true;
        state.error = action.payload;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user;
        state.token = action.payload.token;
        // console.log(action.payload.user);
        
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("access_token", action.payload.token);
        console.log('user slice is workind ', action.payload);
        
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })


      

  },
});

// Export actions and reducer
export const { clearUser, setLoading, setError, } = userSlice.actions;
export default userSlice.reducer;