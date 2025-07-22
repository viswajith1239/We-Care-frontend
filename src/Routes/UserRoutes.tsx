import { Routes, Route } from 'react-router-dom';

import { USER_ROUTES } from '../constants/routeConstants';

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
// import UserProtectRoute from './protector/UserProtectRoute';
import UserChat from "../components/userComponents/UserChat"
import PrescriptionPage from '../pages/userPages/PrescriptionPage';
import AddReportsPage from '../pages/userPages/AddReportsPage';
import AboutPage from '../pages/userPages/AboutPage';
import ContactPage from '../pages/userPages/ContactPage';
import WalletPage from '../pages/userPages/WalletPage';




function UserRoutes() {
    return (
        <Routes>
            {/* <Route path="/"element={<UserProtectRoute><HomePage /></UserProtectRoute>}/> */}
            <Route path={USER_ROUTES.HOME} element={<HomePage />} />
            <Route path={USER_ROUTES.SIGNUP} element={<Signup />} />
            <Route path={USER_ROUTES.VERIFY_OTP} element={<Otp />} />
            <Route path={USER_ROUTES.LOGIN} element={<Login />} />
             <Route path={USER_ROUTES.About} element={<AboutPage />} />
              <Route path={USER_ROUTES.Contact} element={<ContactPage />} />
            <Route path={USER_ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            <Route path={USER_ROUTES.FORGOT_PASSWORD_OTP} element={<ForgotPasswordOtpPage />} />
            <Route path={USER_ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
            <Route path={USER_ROUTES.DOCTORS} element={<DoctorsPage />} />
            <Route path="/doctorsprofileview/:doctorId" element={<DoctorProfileViewPage />} />
            <Route path={USER_ROUTES.PAYMENT_SUCCESS} element={<SuccessPaymentPage />} />
            <Route path={USER_ROUTES.PROFILE} element={<UserLayout />}>
                <Route index element={<UserProfilePage />} />
                <Route path={USER_ROUTES.PROFILE_BOOKINGS} element={<BookingsPage />} />
                <Route path={USER_ROUTES.PROFILE_MESSAGE} element={<UserChat doctorId={''} />} />
                <Route path={USER_ROUTES.PROFILE_PRESCRIPTIONS} element={<PrescriptionPage />} />
                <Route path={USER_ROUTES.PROFILE_REPORTS} element={<AddReportsPage />} />
                <Route path={USER_ROUTES.PROFILE_WALLET} element={<WalletPage />} />
                
            </Route>

        </Routes>
    )
}


export default UserRoutes