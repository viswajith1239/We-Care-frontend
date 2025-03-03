import React, { useEffect, useState } from "react";
import { FaFileAlt , FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import axios from "axios";
import API_URL from "../../axios/API_URL";
import { Link, useNavigate } from "react-router-dom";
import adminAxiosInstance from "../../axios/adminAxiosInstance";

interface Doctor {
  id: string; 
  name: string;
  email: string;
  kycSubmissionDate: string; 
  status: string;
}

interface Errors {
  name?: string;
  description?: string;
}

function Verification() {
  const [doctorsKycData, setDoctorsKycData] = useState<Doctor[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const getAllDoctorsKycData = async () => {
        console.log("///")
      try {
        const response = await adminAxiosInstance.get(`${API_URL}/admin/doctor/kyc`);
        const DoctorsData: Doctor[] = response.data.data.map((doctor: any) => ({          
          id: doctor._id, 
          name: doctor.name,
          email: doctor.email,
          kycSubmissionDate: doctor.kycData?.kycSubmissionDate , 
          status: doctor.kycData?.kycStatus || "Pending", 

        }));
        console.log("response is......>>>>.....>>",response.data.data)
        response.data.data.forEach((doctors:any) => {
            console.log("KYC Data:", doctors.kycData.kycStatus);
          });
          setDoctorsKycData(DoctorsData);
        console.log('all pending trainers',DoctorsData);

      } catch (error) {
        console.error('Error fetching KYC data:', error);
      }
    };
    getAllDoctorsKycData(); 
  }, []); 

  const filteredDoctors = doctorsKycData.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (doctorId: string) => {
    console.log("//////////////doctorId",doctorId)
    navigate(`/admin/doctor-view/${doctorId}`);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-4xl font-bold text-gray-800">Doctor Verification</h2>
        <input
          type="text"
          placeholder="Search Doctors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-md"
        />
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="grid grid-cols-5 text-lg font-semibold text-gray-600 mb-4 border-b border-gray-200 pb-2">
          <div>Name</div>
          <div>Email</div>
          <div>Date</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <div className="grid grid-cols-5 items-center p-2 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-none">
            <div className="text-gray-800 ">{doctor.name}</div>
            <div className="text-gray-800  px-2 truncate max-w-[200px]">
              {doctor.email}
            </div>
            <div className="text-gray-800 ">
              {new Date(doctor.kycSubmissionDate).toDateString()}
            </div>
            <div className="text-orange-500">{doctor.status}</div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleView(doctor.id)}
                className="flex items-center space-x-1 text-white bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <FaFileAlt />
                <span>View</span>
              </button>
            </div>
          </div>
          
          ))
        ) : (
          <div className="text-gray-500 text-center py-6">
            No doctors found.
          </div>
        )}
      </div>

      {/* Modal code can remain the same */}
    </div>
  );
}

export default Verification;