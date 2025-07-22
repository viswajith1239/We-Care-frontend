// import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
// import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { useDispatch } from "react-redux";
import { getDoctorDetails, updateDoctorKYCStatus, updateDoctorStatusWithReason } from "../../service/adminService";

interface Errors {
  rejectionReason?: string;
}

interface Doctor {
  doctorName: string;
  doctorEmail: string;
  doctorPhone: string;
  specialization: string;
  profileImage: string;
  aadhaarFrontSide: string;
  aadhaarBackSide: string;
  certificate: string;
  kycStatus: string;
  kycSubmissionDate: string;
}

function DoctorView() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const { doctorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!doctorId) return
    const fetchDoctorDetails = async (doctorId: string) => {
      try {
        const response = await getDoctorDetails(doctorId)
        console.log("ooo", response);

        const doctorData = response.data?.kycData;
        if (doctorData) {
          const specializations = doctorData.specializationId
            .map((spec: { name: string }) => spec.name)
            .join(", ");
          const data: Doctor = {
            doctorName: doctorData.doctorId.name,
            doctorEmail: doctorData.doctorId.email,
            doctorPhone: doctorData.doctorId.phone,
            specialization: specializations,
            profileImage: doctorData.profileImage,
            aadhaarFrontSide: doctorData.aadhaarFrontSide,
            aadhaarBackSide: doctorData.aadhaarBackSide,
            certificate: doctorData.certificate,
            kycStatus: doctorData.kycStatus,
            kycSubmissionDate: new Date(
              doctorData.createdAt
            ).toLocaleDateString(),
          };
          setDoctor(data);
        } else {
          console.warn("No doctor data found");
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    fetchDoctorDetails(doctorId);
  }, [doctorId]);

  const handleApproveStatusChange = async (newStatus: string) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes",
      }).then(async (result: { isConfirmed: any }) => {
        if (result.isConfirmed && doctorId) {
          try {
            await updateDoctorKYCStatus(doctorId, newStatus);
            setDoctor((prevDoctor) =>
              prevDoctor ? { ...prevDoctor, kycStatus: newStatus } : null
            );
            navigate("/admin/verification");
            Swal.fire("OK!", "Doctor Approved.", "success");
          } catch (error) {
            console.error("Error updating doctor status:", error);
          }
        }
      });
    } catch (error) {
      console.error("Error updating doctor status:", error);
    }
  };

  const handleRejectStatusChange = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrors({});
    setRejectionReason("");
  };

  const validate = (): boolean => {
    let isValid = true;
    const newErrors: Errors = {};
    if (!rejectionReason.trim()) {
      newErrors.rejectionReason = "Please provide a rejection reason.";
      isValid = false;
    }
    if (!isValid) {
      setErrors(newErrors);
      setTimeout(() => {
        setErrors({});
      }, 3000);
    }
    return isValid;
  };

  const handleReasonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !doctorId) {
      return;
    }

    try {
      await updateDoctorStatusWithReason(doctorId, rejectionReason);
      setDoctor((prevDoctor) =>
        prevDoctor ? { ...prevDoctor, kycStatus: "rejected" } : null
      );
      closeModal();
      navigate("/admin/verification");
    } catch (error) {
      console.error(
        "Error updating doctor status with rejection reason:",
        error
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8 space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-800">
        Doctor Details
      </h2>

      {doctor ? (
        <>
          <div className="flex items-center justify-center">
            <img
              src={doctor.profileImage}
              alt="Profile"
              className="w-48 h-48 rounded-full shadow-xl object-cover object-top"
            />
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-800">
              {doctor.doctorName}
            </h3>
            <p className="text-gray-600">{doctor.doctorEmail}</p>
            <p className="text-gray-600">Phone: {doctor.doctorPhone}</p>
          </div>

          <div className="border-t border-gray-300 pt-6">
            <h4 className="font-medium text-lg text-gray-700">
              KYC Information
            </h4>
            <p className="text-sm text-gray-500">
              KYC Submission Date: {doctor.kycSubmissionDate}
            </p>
            <p className="text-sm text-gray-500">Status: {doctor.kycStatus}</p>
            <p className="text-sm text-gray-500">
              Specialization: {doctor.specialization}
            </p>
          </div>

          <div className="border-t border-gray-300 pt-6">
            <h4 className="font-medium text-lg text-gray-700">Documents</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h5 className="font-semibold text-gray-700">
                  Aadhaar Front Image
                </h5>
                <a
                  href={doctor.aadhaarFrontSide}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={doctor.aadhaarFrontSide}
                    alt="Aadhaar Front"
                    className="w-40 h-40 rounded-lg shadow-md hover:scale-105 transition-transform"
                  />
                </a>
              </div>
              <div>
                <h5 className="font-semibold text-gray-700">
                  Aadhaar Back Image
                </h5>
                <a
                  href={doctor.aadhaarBackSide}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={doctor.aadhaarBackSide}
                    alt="Aadhaar Back"
                    className="w-40 h-40 rounded-lg shadow-md hover:scale-105 transition-transform"
                  />
                </a>
              </div>
              <div>
                <h5 className="font-semibold text-gray-700">Certificate</h5>
                <a
                  href={doctor.certificate}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={doctor.certificate}
                    alt="Certificate"
                    className="w-40 h-40 rounded-lg shadow-md hover:scale-105 transition-transform"
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-6">
            <button
              onClick={() => handleApproveStatusChange("approved")}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-md transition-colors transform hover:scale-105"
            >
              <FaCheck className="mr-2" /> Approve
            </button>
            <button
              onClick={handleRejectStatusChange}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-md transition-colors transform hover:scale-105"
            >
              <FaTimes className="mr-2" /> Reject
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">
          No doctor details available.
        </p>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Rejection Reason</h3>
            <form onSubmit={handleReasonSubmit}>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Rejection reason."
                className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.rejectionReason && (
                <div className="text-red-500 mb-4">
                  {errors.rejectionReason}
                </div>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#00897B] text-white px-6 py-3 rounded-full hover:bg-[#00897B]"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorView;