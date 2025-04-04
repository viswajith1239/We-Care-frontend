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
import WalletPage from "../pages/doctorPages/WalletPage";
import DoctorProfilePage from "../pages/doctorPages/DoctorProfilePage";
import DoctorProfileEditPage from "../pages/doctorPages/DoctorProfileEditPage";

function DoctorRoutes() {
  return (
    <Routes>
     
      <Route path="/signup" element={<DoctorSignUpPage />} />
      <Route path="/otp" element={<DoctorOtpPage />} />
      <Route path="/login" element={<DoctorLoginPage />} />

      
      <Route path="/" element={<DoctorLayout />} >
      <Route index element={<ProtectRoute><DoctorDashboard /></ProtectRoute> } />
      <Route  path="/doctor" element={<ProtectRoute> <DoctorKyc /></ProtectRoute> } />
      <Route path="profile" element={<ProtectRoute><DoctorProfilePage /></ProtectRoute>} />
      <Route path="editProfile" element={<ProtectRoute><DoctorProfileEditPage /></ProtectRoute>} />
      <Route path="scheduleappoinments" element={<ProtectRoute><ScheduleAppoinments/></ProtectRoute>} />
      <Route path="wallet" element={<ProtectRoute><WalletPage /></ProtectRoute>} />
      <Route path="messages" element={<DoctorChat doctorId={''} bookingId={null} userId={""}/>}/>
      <Route path="bookings" element={<BookingsPage/>}/>
       
      </Route>
    </Routes>
  );
}

export default DoctorRoutes;
