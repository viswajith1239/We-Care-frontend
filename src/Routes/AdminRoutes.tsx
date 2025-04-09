import {Route,Routes} from "react-router-dom"

import Login from "../pages/adminPages/Login"

import AdminLayout from "../components/adminComponents/AdminLayout"
import SpecializationsPage from "../pages/adminPages/SpecializationPage"
import UserListingPage from "../pages/adminPages/UserListingPage"
import VerificatonPage from "../pages/adminPages/VerificatonPage"
import DoctorVerifyPage from "../pages/adminPages/DoctorVerifyPage"
import AdminDashboardPage from "../pages/adminPages/AdminDashboardPage"

function AdminRoutes(){
    return(
        <Routes>
            <Route path="/login"element={<Login/>}/>
            <Route path="/" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage/>}/>
            <Route path="/specialisations" element={<SpecializationsPage />} />
            <Route path="/user-listing" element={<UserListingPage />} />
            <Route path="/verification" element={<VerificatonPage />} />
            <Route path="/doctor-view/:doctorId" element={<DoctorVerifyPage />} />
            

            </Route>
        </Routes>
    )
}
export default AdminRoutes