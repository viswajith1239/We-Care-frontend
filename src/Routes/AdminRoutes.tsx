import {Route,Routes} from "react-router-dom"

import Login from "../pages/adminPages/Login"

import AdminLayout from "../components/adminComponents/AdminLayout"
import SpecializationsPage from "../pages/adminPages/SpecializationPage"
import UserListingPage from "../pages/adminPages/UserListingPage"

function AdminRoutes(){
    return(
        <Routes>
            <Route path="/login"element={<Login/>}/>
            <Route path="/" element={<AdminLayout />}>
            <Route path="/specialisations" element={<SpecializationsPage />} />
            <Route path="/user-listing" element={<UserListingPage />} />
            

            </Route>
        </Routes>
    )
}
export default AdminRoutes