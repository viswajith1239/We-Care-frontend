import {createSlice,PayloadAction} from "@reduxjs/toolkit"
import { registerDoctor,loginDoctor } from "../action/doctorActions"


interface DoctorState{
    doctorInfo:null|any,
    loading:null|any
    // kycStatus: string;


    // trainerToken:null |any,
   // specializations:null|any
    error:null|any
}

const doctor = localStorage.getItem("doctor");
const parsedDoctor = doctor && doctor !== "undefined" ? JSON.parse(doctor) : null;

const initialState:DoctorState={
    doctorInfo:parsedDoctor,
    loading:false,
    error:null,
    // kycStatus: "pending",

    // doctorToken:localStorage.getItem("trainer_access_token") || null,
    // specializations: [],

}

const doctorSlice=createSlice({
    name: "doctor",
    initialState,
    reducers:{
        clearDoctor(state) {
            state.doctorInfo = null;
            //state.doctorToken = null;
            //state.specializations = [];
            
          },
          
    },
    extraReducers: (builder) => {
        builder
        .addCase(registerDoctor.pending, (state) => {
          state.loading=true

          })
          .addCase(registerDoctor.fulfilled, (state, action: PayloadAction<any>) => {
            
            state.loading=false
            state.doctorInfo = action.payload;
            
        
          })
          .addCase(registerDoctor.rejected, (state, action: PayloadAction<any>) => {
        
            state.loading=false

            console.log('acion',action.payload);
          }) 
          .addCase(loginDoctor.pending, (state) => {
            state.loading=true

            
          })
          .addCase(loginDoctor.fulfilled, (state, action: PayloadAction<any>) => {
            
            state.loading=false

            state.doctorInfo = action.payload.doctor
            console.log("_______doctorinfo", state.doctorInfo)
           // state.trainerToken = action.payload.token;
            localStorage.setItem("trainer", JSON.stringify(action.payload.trainer));
            localStorage.setItem("trainer_access_token", action.payload.token);
          })
          .addCase(loginDoctor.rejected, (state) => {
            state.loading=false

            
          }) 
        }

})
export const { clearDoctor  } = doctorSlice.actions;
export default doctorSlice.reducer;