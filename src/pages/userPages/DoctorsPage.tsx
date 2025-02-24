import DoctorsList from "../../components/userComponents/DoctorList";
import Footer from "../../components/userComponents/Footer";
import Header from "../../components/userComponents/Header";
import DoctorsListFilterBar from "../../components/userComponents/DoctorListFilterBar"

function DoctorsPage() {
    return (
      <div className="min-h-screen flex flex-col ">
        
        <Header />
  
       
        
  
       
        <div className="flex flex-1 bg-gray-100">
         
          <div className="w-80 bg-white shadow-lg p-4 md:w-72 lg:w-64">
            <DoctorsListFilterBar onFilterChange={function (filters: { specialization: string; gender: string; priceRange: [number, number]; language: string; }): void {
              throw new Error('Function not implemented.');
            } } />
         
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mt-10">About Our Doctors</h3>
              <p className="text-sm text-gray-600 mt-2">
              Our doctors specialize in diagnosis, treatment, and holistic care to provide personalized guidance for your health and well-being
              </p>
            </div>
          </div>
  
         
          <div className="flex-1 p-6 overflow-y-auto h-screen">
            <DoctorsList />
          </div>
        </div>
  
        {/* Footer */}
        <Footer/>
      </div>
    );
  }
  
  export default DoctorsPage;