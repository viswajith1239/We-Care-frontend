import { useEffect, useState } from "react";
import { Specialization } from "../../types/doctor";
import { useNavigate, useLocation } from "react-router-dom";
import { getspecializations } from "../../service/userService";

function DoctorListFiterBar() {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [selectedExperience, setSelectedExperience] = useState<string>("");
  const [displayLimit, setDisplayLimit] = useState(4);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortOption, setSortOption] = useState("a-z");

  const navigate = useNavigate();
  const location = useLocation();

  // Experience ranges configuration - Fixed ranges
  const experienceRanges = [
    { value: "0-2", label: "0-2 Years" },
    { value: "3-4", label: "3-4 Years" },    // Changed from "2-4" to "3-4"
    { value: "5-8", label: "5-8 Years" },
    { value: "9-15", label: "9-15 Years" },
    { value: "15+", label: "15+ Years" }
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sort = params.get("sort");
    const experience = params.get("experience");
    const specialization = params.get("specialization");
    const gender = params.get("gender");
    const language = params.get("language");
    
    if (sort) setSortOption(sort);
    if (experience) setSelectedExperience(experience);
    if (specialization) setSelectedSpecialization(specialization);
    if (gender) setSelectedGender(gender);
    if (language) setSelectedLanguage(language);

    const getSpecializations = async () => {
      try {
        const response = await getspecializations();
        setSpecializations(response.data);
      } catch (error) {
        console.log("Error fetching specializations:", error);
      }
    };
    getSpecializations();
  }, [location.search]);

  const handleSelect = (type: string, value: string) => {
    const params = new URLSearchParams(window.location.search);

    if (type === "specialization") {
      const newValue = selectedSpecialization === value ? "" : value;
      setSelectedSpecialization(newValue);
      if (newValue) {
        params.set(type, newValue);
      } else {
        params.delete(type);
      }
    } else if (type === "gender") {
      const newValue = selectedGender === value ? "" : value;
      setSelectedGender(newValue);
      if (newValue) {
        params.set(type, newValue);
      } else {
        params.delete(type);
      }
    } else if (type === "language") {
      const newValue = selectedLanguage === value ? "" : value;
      setSelectedLanguage(newValue);
      if (newValue) {
        params.set(type, newValue);
      } else {
        params.delete(type);
      }
    } else if (type === "experience") {
      const newValue = selectedExperience === value ? "" : value;
      setSelectedExperience(newValue);
      if (newValue) {
        params.set("experience", newValue);
      } else {
        params.delete("experience");
      }
    }

    navigate(`/doctors?${params.toString()}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortOption(value);
    const params = new URLSearchParams(window.location.search);
    params.set("sort", value);
    navigate(`/doctors?${params.toString()}`);
  };

  const handleToggleDisplay = () => {
    setDisplayLimit(isExpanded ? 4 : specializations.length);
    setIsExpanded(!isExpanded);
  };

  const handleResetFilters = () => {
    setSelectedSpecialization("");
    setSelectedGender("");
    setSelectedLanguage("");
    setSelectedExperience("");
    setSortOption("a-z");
    navigate("/doctors");
  };

  return (
    <div className="sticky top-20 h-[calc(100vh-80px)] w-63 bg-gray-100 text-black flex flex-col shadow-lg overflow-y-auto">
      <h2 className="text-2xl font-bold p-4 border-b border-gray-700">Filters</h2>

      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold mb-2">Sort By</h3>
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="w-full p-2 bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="a-z">Name: A to Z</option>
          <option value="z-a">Name: Z to A</option>
        </select>
      </div>

      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold mb-2">Experience</h3>
        <select
          value={selectedExperience}
          onChange={(e) => handleSelect("experience", e.target.value)}
          className="w-full p-2 bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Experience Levels</option>
          {experienceRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

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
                checked={selectedSpecialization === spec._id}
                disabled={selectedSpecialization !== "" && selectedSpecialization !== spec._id}
                className={`mr-2 w-4 h-4 border-2 border-gray-400 rounded-sm checked:bg-blue-500 ${
                  selectedSpecialization !== "" && selectedSpecialization !== spec._id
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              />
              <label
                htmlFor={spec._id}
                className={`p-2 rounded ${
                  selectedSpecialization !== "" && selectedSpecialization !== spec._id
                    ? "opacity-50 cursor-not-allowed text-gray-400"
                    : "cursor-pointer hover:bg-gray-200"
                }`}
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
                checked={selectedGender === gender}
                disabled={selectedGender !== "" && selectedGender !== gender}
                className={`mr-2 w-4 h-4 border-2 border-gray-400 rounded-sm checked:bg-blue-500 ${
                  selectedGender !== "" && selectedGender !== gender
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              />
              <label
                htmlFor={gender}
                className={`p-2 rounded ${
                  selectedGender !== "" && selectedGender !== gender
                    ? "opacity-50 cursor-not-allowed text-gray-400"
                    : "cursor-pointer hover:bg-gray-200"
                }`}
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
                checked={selectedLanguage === language}
                disabled={selectedLanguage !== "" && selectedLanguage !== language}
                className={`mr-2 w-4 h-4 border-2 border-gray-400 rounded-sm checked:bg-blue-500 ${
                  selectedLanguage !== "" && selectedLanguage !== language
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              />
              <label
                htmlFor={language}
                className={`p-2 rounded ${
                  selectedLanguage !== "" && selectedLanguage !== language
                    ? "opacity-50 cursor-not-allowed text-gray-400"
                    : "cursor-pointer hover:bg-gray-200"
                }`}
              >
                {language}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleResetFilters}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded mx-4 mb-4 hover:bg-red-600 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
}

export default DoctorListFiterBar;