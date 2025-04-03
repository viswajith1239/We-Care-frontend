import { useEffect, useState } from 'react';
import userAxiosInstance from '../../axios/userAxiosInstance';
import API_URL from '../../axios/API_URL';
import {Doctor} from "../../types/doctor"
import {useNavigate}  from 'react-router-dom';
import { useLocation } from "react-router-dom";
function DoctorsList() {
    // const[doctors,setDoctors]=useState<Doctor[]>([])
    const [doctorsData, setDoctorsData] = useState<Doctor[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [displayLimit, setDisplayLimit] = useState(6);



    const navigate=useNavigate()
    const location = useLocation();

    useEffect(()=>{
        console.log("yes in useeffect")
        async function fetchAllDoctors(){
            try {
                const response=await userAxiosInstance.get<Doctor[]>(`${API_URL}/user/doctors`)
             //   const doctorsData=response.data
              //  seDoctors(doctorsData)

              console.log("ooooo",response);
              
              const doctors = response.data;

              const params = new URLSearchParams(location.search);
              const selectedGender = params.get("gender")?.toLowerCase();
              const selectedLanguage = params.get("language")?.toLowerCase();
              const selectedSpecialization = params.get("specialization");
      
              const filteredDoctors = doctors.filter((doctor) => {
                const matchesGender = selectedGender
                  ? doctor.gender?.toLowerCase() === selectedGender
                  : true;
                const matchesLanguage = selectedLanguage
                  ? Array.isArray(doctor.language)
                    ? doctor.language?.some(
                        (lang) => lang.toLowerCase() === selectedLanguage
                      )
                    : doctor.language?.toLowerCase() === selectedLanguage
                  : true;

                const matchesSpecialization = selectedSpecialization
                  ? doctor.specializations?.some(
                      (spec) => spec._id === selectedSpecialization
                    )
                  : true;
                  
                return matchesGender && matchesLanguage && matchesSpecialization;
              });
                setDoctorsData(filteredDoctors);
                console.log("Filtered Doctors:", filteredDoctors);

            } catch (error) {
                console.log("error in fetching doctors",error)
            }
        }
        fetchAllDoctors()
    }, [location.search])
    const handleViewProfile = (doctorId: string) => {
      navigate(`/doctorsprofileview/${doctorId}`);
    };

    const filteredDoctors = doctorsData.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specializations.some((spec) =>
          spec.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    console.log("Search Term:", searchTerm);
    console.log("Doctors Data:", doctorsData);

    const handleLoadMore = () => {
      setDisplayLimit((prevLimit) => prevLimit + 6); 
    };
  
  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-black">
        Meet Our Doctors
      </h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search for a doctor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6">
        {filteredDoctors.slice(0, displayLimit).map((doctor: Doctor) => (
          <div
            key={doctor._id}
            className=" bg-white shadow-lg rounded-xl overflow-hidden transform transition-transform hover:scale-105 col-span-2 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
          >
          
            
            <img
              src={doctor.profileImage}
              alt={doctor.name}
              className="w-full h-[200px] object-cover object-top"
            />
            <div className="p-4 text-center">
            <h1 className="font-semibold text-xl pt-4">Dr. {doctor.name}</h1>
              <div className="text-gray-600 flex justify-center mt-3 space-x-2">
                {doctor.specializations.map((spec) => (
                  <p className="bg-blue-100 rounded-xl text-sm " key={spec._id}>
                    {spec.name}
                  </p>
                ))}
              </div>              
              <button onClick={()=>handleViewProfile(doctor._id)} className="mt-4 px-4 py-2 bg-[#00897B] text-white font-medium rounded-full hover:bg-[#00897B] transition">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
      {filteredDoctors.length > displayLimit && (
          <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            className="bg-[#00897B] hover:bg-[#00897B] text-white py-2 px-6 rounded"
          >
            Load More Doctors
          </button>
        </div>
      )}
      {filteredDoctors.length === 0 && (
        <div className="flex items-center justify-center col-span-full mt-10">
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-4">
              Sorry, we couldn't find any doctors that matched your criteria.
            </h1>
            <p className="text-gray-600">
              Try removing some of your search filters. <br/>
              (Helpful tip: You can book different doctors and continue a healty life 
            )
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorsList;