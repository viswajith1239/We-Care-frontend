import DoctorsList from "../../components/userComponents/DoctorList";
import Footer from "../../components/userComponents/Footer";
import Header from "../../components/userComponents/Header";

function DoctorsPage() {
    return (
      <div className="min-h-screen flex flex-col ">
        
        <Header />
  
       
        {/* <TrainersListBanner /> */}
  
       
        <div className="flex flex-1 bg-gray-100">
         
          <div className="w-80 bg-white shadow-lg p-4 md:w-72 lg:w-64">
            {/* <TrainerListFilterBar onFilterChange={function (filters: { specialization: string; gender: string; priceRange: [number, number]; language: string; }): void {
              throw new Error('Function not implemented.');
            } } /> */}
         
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mt-10">About Our Trainers</h3>
              <p className="text-sm text-gray-600 mt-2">
                Our trainers specialize in yoga, fitness, meditation, and more to provide tailored guidance for your wellness journey.
              </p>
            </div>
          </div>
  
         
          <div className="flex-1 p-6">
            <DoctorsList />
          </div>
        </div>
  
        {/* Footer */}
        <Footer/>
      </div>
    );
  }
  
  export default DoctorsPage;