// import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRoutes from "./Routes/UserRoutes";
import AdminRoutes from "./Routes/AdminRoutes";
import DoctorRoutes from "./Routes/DoctorRoutes";
import './App.css'


function App() {
  

  return (
    <>
      <Router>
         <Routes>
         <Route path="/*" element={<UserRoutes />} />
         <Route path="/admin/*" element={<AdminRoutes/>} />
         <Route path="/doctor/*" element={<DoctorRoutes/>}/>
          </Routes>
      </Router>
    </>
  )
}

export default App
