import axios from "axios";
import { useEffect, useState } from "react";
import API_URL from "../../axios/API_URL";
import { Specialization } from "../../types/doctor";
import { useNavigate } from "react-router-dom";
import userAxiosInstance from "../../axios/userAxiosInstance";

function DoctorListFiterBar() {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [displayLimit, setDisplayLimit] = useState(4);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const navigate = useNavigate();

  useEffect(()=>{

    const getspecializations=async()=>{
       try {
         const response=await userAxiosInstance.get(`${API_URL}/user/specializations`)
         console.log("bbbbb",response);
         
         setSpecializations(response.data)
       } catch (error) {
         console.log("error in fetching specialisation:",error)
       }
     }
     getspecializations()
   },[])

  const handleSelect = (type: string, value: string) => {
    let updatedSelections: any = [];
    if (type === "specialization") {
      updatedSelections = selectedSpecializations.includes(value)
        ? selectedSpecializations.filter((id) => id !== value)
        : [...selectedSpecializations, value];
      setSelectedSpecializations(updatedSelections);
    } else if (type === "gender") {
      updatedSelections = selectedGender.includes(value)
        ? selectedGender.filter((gender) => gender !== value)
        : [...selectedGender, value];
      setSelectedGender(updatedSelections);
    } else if (type === "language") {
      updatedSelections = selectedLanguages.includes(value)
        ? selectedLanguages.filter((language) => language !== value)
        : [...selectedLanguages, value];
      setSelectedLanguages(updatedSelections);
    }

    // Update URL query parameters
    const params = new URLSearchParams(window.location.search);
    if (updatedSelections.length > 0) {
      params.set(type, updatedSelections.join(","));
    } else {
      params.delete(type);
    }
    navigate(`/doctors?${params.toString()}`);
  };

  const handleToggleDisplay = () => {
    if (isExpanded) {
      setDisplayLimit(4);
    } else {
      setDisplayLimit(specializations.length);
    }
    setIsExpanded(!isExpanded);
  };

  const handleResetFilters = () => {
    setSelectedSpecializations([]);
    setSelectedGender([]);
    setSelectedLanguages([]);
    const params = new URLSearchParams(window.location.search);
    params.delete("specialization");
    params.delete("gender");
    params.delete("language");
    navigate(`/doctors?${params.toString()}`);
  };

  return (
    <div className="sticky top-20 h-[calc(100vh-80px)] w-63 bg-gray-100 text-black flex flex-col shadow-lg overflow-y-auto">
  <h2 className="text-2xl font-bold p-4 border-b border-gray-700">Filters</h2>

  <div className="p-4 border-b border-gray-700">
    <h3 className="text-lg font-semibold mb-2">Specialization</h3>
    <ul className="space-y-2">
      {specializations.slice(0, displayLimit).map((spec) => (
        <li key={spec._id} className="flex items-center">
          <input
            onChange={() => handleSelect("specialization", spec._id)}
            type="checkbox"
            id={spec._id}
            name="specialization"
            checked={selectedSpecializations.includes(spec._id)}
            className="mr-2 w-4 h-4 border-2 border-gray-400 rounded-sm checked:bg-blue-500"
          />
          <label
            htmlFor={spec._id}
            className="cursor-pointer hover:bg-gray-200 p-2 rounded"
          >
            {spec.name}
          </label>
        </li>
      ))}
    </ul>
    {specializations.length > 4 && (
      <button
        className="text-sm font-medium text-blue-500 mt-2"
        onClick={handleToggleDisplay}
      >
        {isExpanded ? "SEE LESS" : "SEE MORE"}
      </button>
    )}
  </div>

  <div className="p-4 border-b border-gray-700">
    <h3 className="text-lg font-semibold mb-2">Gender</h3>
    <ul className="space-y-2">
      {["Male", "Female"].map((gender) => (
        <li key={gender} className="flex items-center">
          <input
            onChange={() => handleSelect("gender", gender)}
            type="checkbox"
            id={gender}
            name="gender"
            checked={selectedGender.includes(gender)}
            className="mr-2 w-4 h-4 border-2 border-gray-400 rounded-sm checked:bg-blue-500"
          />
          <label
            htmlFor={gender}
            className="cursor-pointer hover:bg-gray-200 p-2 rounded"
          >
            {gender}
          </label>
        </li>
      ))}
    </ul>
  </div>

  <div className="p-4 border-b border-gray-700">
    <h3 className="text-lg font-semibold mb-2">Language</h3>
    <ul className="space-y-2">
      {["English", "Spanish", "French", "German"].map((language) => (
        <li key={language} className="flex items-center">
          <input
            onChange={() => handleSelect("language", language)}
            type="checkbox"
            id={language}
            name="language"
            checked={selectedLanguages.includes(language)}
            className="mr-2 w-4 h-4 border-2 border-gray-400 rounded-sm checked:bg-blue-500"
          />
          <label
            htmlFor={language}
            className="cursor-pointer hover:bg-gray-200 p-2 rounded"
          >
            {language}
          </label>
        </li>
      ))}
    </ul>
  </div>

  <button
    onClick={handleResetFilters}
    className="mt-4 bg-red-500 text-white py-2 px-4 rounded mx-4 mb-4"
  >
    Reset Filters
  </button>
</div>

  );
}

export default DoctorListFiterBar;