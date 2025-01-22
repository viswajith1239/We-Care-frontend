import { configureStore } from '@reduxjs/toolkit';


import userSlice from "../slice/UserSlice" 
import doctorReducer from "../slice/DoctorSlice"




const store = configureStore({
    reducer: {
        user: userSlice,
        doctor:doctorReducer
        
    }
})

export default store

export type RootState = ReturnType<typeof store.getState>; 
export type AppDispatch = typeof store.dispatch; 