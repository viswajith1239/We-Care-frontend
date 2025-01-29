import {createSlice,PayloadAction} from "@reduxjs/toolkit"
import { registerDoctor,loginDoctor,submitKyc,getKycStatus} from "../action/doctorActions"


interface DoctorState{
    doctorInfo:null|any,
    loading:null|any
    kycStatus: string;


    error:null|any  
}

const doctor = localStorage.getItem("doctor");
const parsedDoctor = doctor && doctor !== "undefined" ? JSON.parse(doctor) : null;

const initialState:DoctorState={
    doctorInfo:parsedDoctor,
    loading:false,
    error:null,
    kycStatus: "pending",

    // doctorToken:localStorage.getItem("trainer_access_token") || null,
    // specializations: [],

}

const doctorSlice=createSlice({
    name: "doctor",
    initialState,
    reducers:{
        clearDoctor(state) {
            state.doctorInfo = null;
           
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
            console.log("doctorinfo", state.doctorInfo)
         
            localStorage.setItem("doctor", JSON.stringify(action.payload.doctor));
            localStorage.setItem("doctor_access_token", action.payload.token);
          })
          .addCase(loginDoctor.rejected, (state) => {
            state.loading=false

            
          }) 
          .addCase(submitKyc.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          //////////////////////////
          .addCase(submitKyc.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
          
            console.log('submitt kyc',action.payload);
            
            state.error = null;
          })
          .addCase(submitKyc.rejected, (state, _action: PayloadAction<any>) => {
            state.loading = false;
        
          })

          .addCase(getKycStatus.pending, (state) => {
            console.log("pending case slice")
            state.loading = true;
            state.error = null;
          })
          .addCase(getKycStatus.fulfilled, (state, action: PayloadAction<any>) => {
            console.log("fulfilled case slice")

            console.log("yes ethii")
            state.loading = false;
            state.kycStatus = action.payload.kycStatus;
            console.log('get kyc',action.payload.kycStatus);
            
            state.error = null;
          })
          .addCase(getKycStatus.rejected, (state, action: PayloadAction<any>) => {
            console.log("rejected case slice")

            state.loading = false;
            state.error = action.payload?.message || "OTP verification failed";
          })
        }

})
export const { clearDoctor  } = doctorSlice.actions;
export default doctorSlice.reducer;