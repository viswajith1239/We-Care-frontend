// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { UserState,  } from "./userTyepes";
// import { registerForm } from "../action/userActions";

// // Initial state
// const user = localStorage.getItem("user");

// const final = user ? JSON.parse(user) : null;

// const initialState: UserState = {
//   userInfo: final?final : null,
//   token: localStorage.getItem("access_token") || null,
//   loading: false,
//   error: null,
 

  
// };

// // User slice
// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     clearUser(state) {
//       state.userInfo = null;
//     },
//     setLoading(state, action: PayloadAction<boolean>) {
//       state.loading = action.payload;
//     },
//     setError(state, action: PayloadAction<string>) {
//       state.error = action.payload;
//     },
    
    
//   },
//   extraReducers: (builder) => {
//     builder
//       // Register user actions
//       .addCase(registerForm.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//   },
// });

// // Export actions and reducer
// export const { clearUser, setLoading, setError,} = userSlice.actions;
// export default userSlice.reducer;