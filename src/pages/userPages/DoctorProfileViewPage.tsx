
import Header from "../../components/userComponents/Header";
import Footer from "../../components/userComponents/Footer";

import React from 'react'
import DoctorsProfileView from "../../components/userComponents/DoctorProfileView";

function DoctorProfileViewPage() {
  return (
    <div>
         <Header />
        <DoctorsProfileView />
        <Footer />
      
    </div>
  )
}

export default DoctorProfileViewPage