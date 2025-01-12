import {Route,Routes} from "react-router-dom"
import DoctorSignUpPage from "../pages/doctorPages/DoctorSignup"
import DoctorOtpPage from "../pages/doctorPages/DoctorOtp"
import DoctorLoginPage from "../pages/doctorPages/DoctorLogin"


function DoctorRoutes(){
    return(
        <Routes>
            <Route path="/signup"element={<DoctorSignUpPage/>}/>
            <Route path="/otp" element={<DoctorOtpPage/>}/>
            <Route path="/login" element={<DoctorLoginPage/>}/>
        </Routes>
    )
}
export default DoctorRoutes