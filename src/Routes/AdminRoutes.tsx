import { Route, Routes } from "react-router-dom"
import { ADMIN_ROUTES } from "../constants/routeConstants"

import Login from "../pages/adminPages/Login"

import AdminLayout from "../components/adminComponents/AdminLayout"
import SpecializationsPage from "../pages/adminPages/SpecializationPage"
import UserListingPage from "../pages/adminPages/UserListingPage"
import VerificatonPage from "../pages/adminPages/VerificatonPage"
import DoctorVerifyPage from "../pages/adminPages/DoctorVerifyPage"
import AdminDashboardPage from "../pages/adminPages/AdminDashboardPage"

function AdminRoutes() {
    return (
        <Routes>
            <Route path={ADMIN_ROUTES.LOGIN} element={<Login />} />
            <Route path={ADMIN_ROUTES.BASE} element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path={ADMIN_ROUTES.SPECIALIZATIONS} element={<SpecializationsPage />} />
                <Route path={ADMIN_ROUTES.USER_LISTING} element={<UserListingPage />} />
                <Route path={ADMIN_ROUTES.VERIFICATION} element={<VerificatonPage />} />
                <Route path="/doctor-view/:doctorId" element={<DoctorVerifyPage />} />


            </Route>
        </Routes>
    )
}
export default AdminRoutes