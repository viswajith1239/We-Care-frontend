import { Route, Routes } from "react-router-dom";
import DoctorSignUpPage from "../pages/doctorPages/DoctorSignup";
import DoctorOtpPage from "../pages/doctorPages/DoctorOtp";
import DoctorLoginPage from "../pages/doctorPages/DoctorLogin";
import DoctorLayout from "../components/doctorComponents/DoctorLayout";
import DoctorDashboard from "../components/doctorComponents/DoctorDashboard";
import ProtectRoute from "../Routes/protector/DoctorProtectRoue";
import ScheduleAppoinments from "../components/doctorComponents/ScheduleAppoinments";
import DoctorKyc from "../components/doctorComponents/DoctorKyc";
import DoctorChat from "../components/doctorComponents/DoctorChat"
import BookingsPage from "../pages/doctorPages/BookingsPage";

function DoctorRoutes() {
  return (
    <Routes>
     
      <Route path="/signup" element={<DoctorSignUpPage />} />
      <Route path="/otp" element={<DoctorOtpPage />} />
      <Route path="/login" element={<DoctorLoginPage />} />

      
      <Route path="/" element={<DoctorLayout />} >
      <Route index element={<ProtectRoute><DoctorDashboard /></ProtectRoute> } />
      <Route  path="/doctor" element={<ProtectRoute> <DoctorKyc /></ProtectRoute> } />
      <Route path="scheduleappoinments" element={<ProtectRoute><ScheduleAppoinments/></ProtectRoute>} />
      <Route path="messages" element={<DoctorChat doctorId={''}/>}/>
      <Route path= "bookings" element={<BookingsPage/>}/>
       
      </Route>
    </Routes>
  );
}

export default DoctorRoutes;
