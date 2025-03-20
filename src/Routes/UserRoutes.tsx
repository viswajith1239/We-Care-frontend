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
import UserLayout from '../components/userComponents/UserLayout';
import UserProfilePage from '../pages/userPages/UserProfilePage';
import BookingsPage from '../pages/userPages/BookingsPage';
import UserProtectRoute from './protector/UserProtectRoute';
import UserChat from "../components/userComponents/UserChat"




function UserRoutes() {
    return(
    <Routes>
        <Route path="/"element={<UserProtectRoute><HomePage /></UserProtectRoute>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/verifyotp" element={<Otp/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path='forgot-password' element={<ForgotPasswordPage/>}/>
        <Route path='forgot-passwordotp' element={<ForgotPasswordOtpPage/>}/>
        <Route path='resetpassword' element={<ResetPasswordPage/>}/>
        <Route path="/doctors" element={<DoctorsPage/>}/>
        <Route path="/doctorsprofileview/:doctorId" element={<DoctorProfileViewPage/>} />
        <Route path="/paymentSuccess"element={<SuccessPaymentPage/>}/>
        <Route path="/profile"element={<UserLayout/>}>
        <Route index element={<UserProfilePage/>}/>
        <Route path="bookings" element={<BookingsPage/>}/>
        <Route path="message" element={<UserChat doctorId={''}/>}/>
        </Route>
        
    </Routes>
    )
}


export default UserRoutes