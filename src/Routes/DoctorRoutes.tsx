import {Route,Routes} from "react-router-dom"
import DoctorSignUpPage from "../pages/doctorPages/DoctorSignup"
import DoctorOtpPage from "../pages/doctorPages/DoctorOtp"
import DoctorLoginPage from "../pages/doctorPages/DoctorLogin"
import DoctorLayout from "../components/doctorComponents/DoctorLayout"
// import DoctorKyc from "../components/doctorComponents/DoctorKyc"
import DoctorDashboard from "../components/doctorComponents/DoctorDashboard"
import ProtectRoute from "../Routes/protector/DoctorProtectRoue"


function DoctorRoutes(){
    return(
        <Routes>
             <Route path="/" element={<DoctorLayout/>}/>
            <Route path="/signup"element={<DoctorSignUpPage/>}/>
            <Route path="/otp" element={<DoctorOtpPage/>}/>
            <Route path="/login" element={<DoctorLoginPage/>}/>
            {/* <Route index element={<DoctorDashboard/>}/> */}
            {/* <Route path="/doctorkyc" element={<DoctorKyc/>}/> */}
            <Route index element={<ProtectRoute><DoctorDashboard/></ProtectRoute>}/>

        </Routes>
    )
}
export default DoctorRoutes