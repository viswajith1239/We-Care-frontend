import {Route,Routes} from "react-router-dom"

import Login from "../pages/adminPages/Login"

import AdminLayout from "../components/adminComponents/AdminLayout"
import SpecializationsPage from "../components/adminComponents/Specialization"

function AdminRoutes(){
    return(
        <Routes>
            <Route path="/login"element={<Login/>}/>
            <Route path="/" element={<AdminLayout />}>
            <Route path="/specialisations" element={<SpecializationsPage />} />
            

            </Route>
        </Routes>
    )
}
export default AdminRoutes