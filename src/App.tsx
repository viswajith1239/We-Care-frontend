// import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRoutes from "./Routes/UserRoutes";
import AdminRoutes from "./Routes/AdminRoutes";
import DoctorRoutes from "./Routes/DoctorRoutes";
import OutgoingVideoCallPage from "./pages/doctorPages/OutgoingVideoCallPage";
import VideoCallPageDoctor from "./pages/doctorPages/VideoCallPageDoctor";
import IncomingVideoCallPage from "./pages/userPages/IncomingVideoCallPage";
import VideoCallPage from "./pages/userPages/VideoCallPage";
import './App.css'
import { RootState } from "./app/store";
import { useSelector } from "react-redux";


function App() {
  const {videoCall, showVideoCallDoctor} = useSelector((state: RootState) => state.doctor)
  const {showIncomingVideoCall, showVideoCallUser} = useSelector((state: RootState) => state.user)
  console.log("vvvv",showVideoCallUser);
  console.log("iiii",showVideoCallDoctor);
  
  
  // console.log("showIncomingVideoCall:12", showIncomingVideoCall);
  //     console.log("showVideoCallUser:", showVideoCallUser);

  return (
    
    <>
      <Router>
      
      {videoCall && <OutgoingVideoCallPage />} 
      {showIncomingVideoCall?._id && <IncomingVideoCallPage />} 
      {showVideoCallDoctor && < VideoCallPageDoctor/>} 
      {showVideoCallUser && <VideoCallPage />}
         <Routes>
         <Route path="/*" element={<UserRoutes />} />
         <Route path="/admin/*" element={<AdminRoutes/>} />
         <Route path="/doctor/*" element={<DoctorRoutes/>}/>
          </Routes>
      </Router>
    </>
  )
}

export default App
