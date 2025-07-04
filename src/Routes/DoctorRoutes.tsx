import { Route, Routes } from "react-router-dom";
import { DOCTOR_ROUTES } from "../constants/routeConstants";
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
import ForgotPasswordPage from "../pages/doctorPages/ForgotPasswordPage";
import ForgotPasswordOtpPage from "../pages/doctorPages/ForgotPasswordOtpPage";
import ResetPasswordPage from "../pages/doctorPages/ResetPasswordPage";
import PrescriptionsPage from "../pages/doctorPages/PrescriptionsPage";
import ReportPage from "../pages/doctorPages/ReportPage";

function DoctorRoutes() {
  return (
    <Routes>
     
      <Route path={DOCTOR_ROUTES.SIGNUP} element={<DoctorSignUpPage />} />
      <Route path={DOCTOR_ROUTES.OTP}element={<DoctorOtpPage />} />
      <Route path={DOCTOR_ROUTES.LOGIN} element={<DoctorLoginPage />} />
      <Route path={DOCTOR_ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage/>}/>
      <Route path={DOCTOR_ROUTES.FORGOT_PASSWORD_OTP} element={<ForgotPasswordOtpPage/>}/>
      <Route path={DOCTOR_ROUTES.RESET_PASSWORD} element={<ResetPasswordPage/>}/>

      
      <Route path={DOCTOR_ROUTES.BASE}element={<DoctorLayout />} >
      <Route index element={<ProtectRoute><DoctorDashboard /></ProtectRoute> } />
      <Route  path={DOCTOR_ROUTES.KYC} element={<ProtectRoute> <DoctorKyc /></ProtectRoute> } />
      <Route path={DOCTOR_ROUTES.PROFILE} element={<ProtectRoute><DoctorProfilePage /></ProtectRoute>} />
      <Route path={DOCTOR_ROUTES.EDIT_PROFILE}element={<ProtectRoute><DoctorProfileEditPage /></ProtectRoute>} />
      <Route path={DOCTOR_ROUTES.SCHEDULE_APPOINTMENTS} element={<ProtectRoute><ScheduleAppoinments/></ProtectRoute>} />
      <Route path={DOCTOR_ROUTES.WALLET}element={<ProtectRoute><WalletPage /></ProtectRoute>} />
      <Route path={DOCTOR_ROUTES.MESSAGES} element={<DoctorChat doctorId={''} bookingId={null} userId={""}/>}/>
      <Route path={DOCTOR_ROUTES.BOOKINGS}element={<BookingsPage/>}/>
       <Route path={DOCTOR_ROUTES.REPORTS} element={<ReportPage/>}/>
      <Route path={DOCTOR_ROUTES.PRESCRIPTIONS} element={<PrescriptionsPage/>}/>

       
      </Route>
    </Routes>
  );
}

export default DoctorRoutes;
