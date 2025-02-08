import { Routes,Route } from 'react-router-dom';

import Signup from '../pages/userPages/Signup';

import Otp from '../pages/userPages/Otp';

import Login from '../pages/userPages/Login';
import HomePage from '../pages/userPages/HomePage';
import DoctorsPage from '../pages/userPages/DoctorsPage';




function UserRoutes() {
    return(
    <Routes>
         <Route path="/" element={<HomePage/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/verifyotp" element={<Otp/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/doctors" element={<DoctorsPage/>}/>

        
    </Routes>
    )
}


export default UserRoutes