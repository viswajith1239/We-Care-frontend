import { Link } from "react-router-dom";
// import bgImage from "../../assets/doctor-nurses-special-equipment.jpg";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import axiosInstance from "../../axios/doctorAxiosInstance";
// import toast, { Toaster } from "react-hot-toast";
// import Loading from "../spinner/Loading";
import API_URL from "../../axios/API_URL";
import Loading from "../spinner/loading";

interface Specialization {
  name: string;
}

interface DoctorProfileData {
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  specializationDetails: Specialization[];
  gender: string;
  yearsOfExperience: string;
  language: string;
  about: string; // Added the 'about' field
}

function DoctorProfile() {
  const [doctor, setDoctor] = useState<DoctorProfileData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { doctorInfo } = useSelector((state: RootState) => state.doctor);
  const doctorId = doctorInfo.id;

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axiosInstance.get(`${API_URL}/doctor/${doctorId}`);
        console.log(".......",response);
        
        setDoctor(response.data.DoctorData);
      } catch (err) {
        setError("Failed to load doctor data");
      }
    };
    fetchDoctor();
  }, [doctorId]);

  const handleEditClick = () => {
    console.log("Edit button clicked!");
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!doctor) {
    return <div><Loading /></div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-5">
      {/* <div className="w-full max-w-4xl mb-8 flex flex-col items-start gap-4 px-4 md:justify-between">
        <h2 className="text-4xl font-extrabold text-gray-900">
          Trainer Profile
        </h2>
      </div> */}

      <div className="bg-white flex flex-col items-center rounded-lg shadow-lg relative w-full max-w-4xl overflow-hidden">
        <img
        //   src={bgImage}
          alt="Background"
          className="w-full h-64 object-cover"
        />

        <div className="absolute top-36 md:top-44 left-8 md:left-12 flex items-center justify-center">
          <img
            src={doctor[0].profileImage}
            alt="Profile"
            className="w-40 h-40 rounded-full bg-slate-500 object-cover border-4 border-white shadow-lg"
          />
        </div>

        <div className="mt-20 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
          <div className="bg-slate-100 p-4 rounded-lg shadow-sm transition-transform transform hover:scale-105">
            <span className="block text-sm font-semibold text-gray-500">
              Full Name
            </span>
            <span className="text-lg text-gray-800">{doctor[0].name}</span>
          </div>

          <div className="bg-slate-100 p-4 rounded-lg shadow-sm transition-transform transform hover:scale-105">
            <span className="block text-sm font-semibold text-gray-500">
              Email Address
            </span>
            <span className="text-lg text-gray-800">{doctor[0].email}</span>
          </div>

          <div className="bg-slate-100 p-4 rounded-lg shadow-sm transition-transform transform hover:scale-105">
            <span className="block text-sm font-semibold text-gray-500">
              Phone Number
            </span>
            <span className="text-lg text-gray-800">{doctor[0].phone}</span>
          </div>

          <div className="bg-slate-100 p-4 rounded-lg shadow-sm transition-transform transform hover:scale-105">
            <span className="block text-sm font-semibold text-gray-500">
              Specializations
            </span>
            <span className="text-lg text-gray-800">
              {doctor[0].specializationDetails &&
              doctor[0].specializationDetails.length > 0
                ? doctor[0].specializationDetails.map((spec, index) => (
                    <span key={index}>
                      {spec.name}
                      {index < doctor[0].specializationDetails.length - 1
                        ? ", "
                        : ""}
                    </span>
                  ))
                : "Not specified"}
            </span>
          </div>

          <div className="bg-slate-100 p-4 rounded-lg shadow-sm transition-transform transform hover:scale-105">
            <span className="block text-sm font-semibold text-gray-500">
              Gender
            </span>
            <span className="text-lg text-gray-800">
              {doctor[0].gender || "Not specified"}
            </span>
          </div>

          <div className="bg-slate-100 p-4 rounded-lg shadow-sm transition-transform transform hover:scale-105">
            <span className="block text-sm font-semibold text-gray-500">
              Years of Experience
            </span>
            <span className="text-lg text-gray-800">
              {doctor[0].yearsOfExperience || "Not specified"}
            </span>
          </div>

          <div className="bg-slate-100 p-4 rounded-lg shadow-sm transition-transform transform hover:scale-105">
            <span className="block text-sm font-semibold text-gray-500">
              Language
            </span>
            <span className="text-lg text-gray-800">
              {doctor[0].language || "Not specified"}
            </span>
          </div>

          {/* About Section */}
          <div className="bg-slate-100 p-4 rounded-lg shadow-sm transition-transform transform hover:scale-105 col-span-2">
            <span className="block text-sm font-semibold text-gray-500">
              About
            </span>
            <p className="text-lg text-gray-800">
              {doctor[0].about || "Not specified"}
            </p>
          </div>
        </div>

        <button
          onClick={handleEditClick}
          className="mt-4 mb-8 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        >
          <Link to="/doctor/editProfile">Edit Profile</Link>
        </button>
      </div>
    </div>
  );
}

export default DoctorProfile;