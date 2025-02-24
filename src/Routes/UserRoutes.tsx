import { Routes,Route } from 'react-router-dom';

import Signup from '../pages/userPages/Signup';

import Otp from '../pages/userPages/Otp';

import Login from '../pages/userPages/Login';
import HomePage from '../pages/userPages/HomePage';
import DoctorsPage from '../pages/userPages/DoctorsPage';
import DoctorProfileViewPage from '../pages/userPages/DoctorProfileViewPage';
import ForgotPasswordPage from '../pages/userPages/ForgotPasswordPage';
import ForgotPasswordOtpPage from '../pages/userPages/ForgotPasswordOtpPage';
import ResetPasswordPage from '../pages/userPages/ResetPasswordPage';
import SuccessPaymentPage from '../pages/userPages/SuccessPaymentPage';




function UserRoutes() {
    return(
    <Routes>
         <Route path="/" element={<HomePage/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/verifyotp" element={<Otp/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path='forgot-password' element={<ForgotPasswordPage/>}/>
        <Route path='forgot-passwordotp' element={<ForgotPasswordOtpPage/>}/>
        <Route path='resetpassword' element={<ResetPasswordPage/>}/>
        <Route path="/doctors" element={<DoctorsPage/>}/>
        <Route path="/doctorsprofileview/:doctorId" element={<DoctorProfileViewPage/>} />
        <Route path="/paymentSuccess"element={<SuccessPaymentPage/>}/>
        
    </Routes>
    )
}


export default UserRoutes