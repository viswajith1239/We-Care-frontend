import { useEffect, useState } from "react";
import { Doctor } from "../../types/doctor";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchdoctors } from "../../service/userService";

function DoctorsList() {
  const [doctorsData, setDoctorsData] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayLimit, setDisplayLimit] = useState(6);
  const [sortOption, setSortOption] = useState("a-z");

  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to check if doctor's experience matches the selected range
  const matchesExperienceRange = (doctorExperience: string, selectedRange: string): boolean => {
    if (!selectedRange) return true;
    
    const experience = parseInt(doctorExperience || "0");
    
    if (selectedRange === "15+") {
      return experience >= 15;
    }
    
    const [min, max] = selectedRange.split('-').map(Number);
    return experience >= min && experience <= max;
  };

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await fetchdoctors();
        const doctors = response.data;

        const params = new URLSearchParams(location.search);
        const selectedGender = params.get("gender")?.toLowerCase();
        const selectedLanguage = params.get("language")?.toLowerCase();
        const selectedSpecialization = params.get("specialization");
        const selectedExperience = params.get("experience");
        const sortType = params.get("sort") || "a-z";

        setSortOption(sortType);

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
            ? doctor.specializations.some(
              (spec) => spec._id === selectedSpecialization
            )
            : true;
            
          // Fixed experience filtering logic
          const matchesExperience = matchesExperienceRange(
            doctor.yearsOfExperience || "0", 
            selectedExperience || ""
          );

          return matchesGender && matchesLanguage && matchesSpecialization && matchesExperience;
        });

        let sortedDoctors = [...filteredDoctors];
        if (sortType === "a-z") {
          sortedDoctors.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortType === "z-a") {
          sortedDoctors.sort((a, b) => b.name.localeCompare(a.name));
        }

        setDoctorsData(sortedDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    }
    fetchDoctors();
  }, [location.search]);

  useEffect(() => {
    if (doctorsData.length > 0) {
      let sortedDoctors = [...doctorsData];
      if (sortOption === "a-z") {
        sortedDoctors.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortOption === "z-a") {
        sortedDoctors.sort((a, b) => b.name.localeCompare(a.name));
      }
      setDoctorsData(sortedDoctors);
    }
  }, [sortOption]);

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

  const handleLoadMore = () => {
    setDisplayLimit((prevLimit) => prevLimit + 6);
  };

  // Handler for sort option change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);

    const params = new URLSearchParams(location.search);
    params.set("sort", newSortOption);
    navigate({ search: params.toString() }, { replace: true });
  };

  return (
    <div className="bg-white min-h-screen py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-black">
        Meet Our Doctors
      </h1>

      <div className="flex justify-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search for a doctor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="a-z">Sort A-Z</option>
          <option value="z-a">Sort Z-A</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6">
        {filteredDoctors.slice(0, displayLimit).map((doctor: Doctor) => (
          <div
            key={doctor._id}
            className="bg-white shadow-lg rounded-xl overflow-hidden transform transition-transform hover:scale-105 col-span-2 "
          >
            <img
              src={doctor.profileImage}
              alt={doctor.name}
              className="w-full h-[200px] object-cover object-top"
            />
            <div className="p-4 text-center">
              <h3 className="font-semibold text-xl pt-4">Dr. {doctor.name}</h3>
              <p className="text-gray-600">Experience: {doctor.yearsOfExperience} Years</p>
              <div className="text-gray-600 flex justify-center mt-3 space-x-2">
                {doctor.specializations.map((spec) => (
                  <p className="bg-blue-100 rounded-xl text-sm" key={spec._id}>
                    {spec.name}
                  </p>
                ))}
              </div>
              <button
                onClick={() => handleViewProfile(doctor._id)}
                className="mt-4 px-4 py-2 bg-[#00897B] text-white font-medium rounded-full hover:bg-[#00697C] transition"
              >
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
            className="bg-[#00897B] hover:bg-[#00697C] text-white py-2 px-6 rounded"
          >
            Load More Doctors
          </button>
        </div>
      )}
      {filteredDoctors.length === 0 && (
        <div className="flex items-center justify-center col-span-full mt-10">
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-4">
              Sorry, we couldn't find any doctors that match your criteria.
            </h1>
            <p className="text-gray-600">
              Try adjusting your search or filters. <br />
              (Helpful tip: Explore different doctors to continue a healthy life)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorsList;