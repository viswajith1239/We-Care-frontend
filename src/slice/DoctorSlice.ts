import {createSlice,PayloadAction} from "@reduxjs/toolkit"
import { registerDoctor,loginDoctor,submitKyc,getKycStatus, logoutDoctor} from "../action/doctorActions"


interface DoctorState{
    doctorInfo:null|any,
    loading:null|any
    kycStatus: string;
    videoCall:  VideoCallPayload | null;
    showVideoCallDoctor: boolean
    roomIdDoctor: null | string
    doctorToken: null | string;
     showPrescription: boolean

 notificationDoctor: Notification[];
    error:null|any  
}
interface Notification {
  content: string;
  read: boolean;
  createdAt: string;
}
interface VideoCallPayload {
  userID: string;
  type: string;
  callType: string;
  roomId: string;
  userName: string
  // userImage: string;
  doctorName: string;
  doctorImage: string;
  bookingId: string
}

const doctor = localStorage.getItem("doctor");
const parsedDoctor = doctor && doctor !== "undefined" ? JSON.parse(doctor) : null;

const initialState:DoctorState={
  doctorInfo: parsedDoctor,
  loading: false,
  error: null,
  videoCall: null,
  showVideoCallDoctor: false,
  roomIdDoctor: null,
  kycStatus: "pending",
  doctorToken: null,
  showPrescription: false,
  notificationDoctor: []
}

const doctorSlice=createSlice({
    name: "doctor",
    initialState,
    reducers:{
        clearDoctor(state) {
            state.doctorInfo = null;
           
          },

          setVideoCall(state, action: PayloadAction<VideoCallPayload  | null>) {
            state.videoCall = action.payload;
            console.log('state.videoCall user', state.videoCall);
            
          },
          setShowVideoCall(state, action: PayloadAction<boolean>) {
            // console.log("///////whhhhhhhhhh///",action.payload)
            state.showVideoCallDoctor = action.payload;
            console.log('action.payload doctor',action.payload)
            // console.log('showVideoCall Doctor slice><><><><>@@@@@@@@', state.showVideoCallDoctor);
      
          },
          setRoomId(state, action: PayloadAction<string | null>) {
            state.roomIdDoctor = action.payload;
            console.log('roomIdDoctor slice', state.roomIdDoctor);
          },
           setNotificationDoctor(state, action: PayloadAction<Notification[]>) {
      state.notificationDoctor = [...state.notificationDoctor, ...action.payload];
      console.log('action',action.payload);
      
      console.log("notificationDoctor slice", state.notificationDoctor);
    },

    setPrescription(state, action: PayloadAction<boolean>) {
      state.showPrescription = action.payload
    },
    

          endCallDoctor: (state) => {
            state.videoCall = null;
            state.showVideoCallDoctor = false; 
            state.roomIdDoctor = null;   
            localStorage.removeItem("IncomingVideoCall"); 
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

          .addCase(logoutDoctor.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(logoutDoctor.fulfilled, (state) => {
            state.loading = false;
            state.doctorInfo = null;
            state.doctorToken = null;
            localStorage.removeItem("doctor");
            localStorage.removeItem("doctor_access_token");
          })
        }

})
export const { clearDoctor, setVideoCall,setShowVideoCall ,setRoomId,endCallDoctor,setPrescription, setNotificationDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;