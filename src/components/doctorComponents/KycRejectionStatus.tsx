import axiosInstance from "../../axios/doctorAxiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useEffect, useState } from "react";
import DoctorKyc from "../doctorComponents/DoctorKyc";
import API_URL from "../../axios/API_URL";

function KycRejectionStatus() {
  const [isResubmitted, setIsResubmitted] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const { doctorInfo } = useSelector((state: RootState) => state.doctor);
  const doctorId = doctorInfo.id;

  const handleResubmit = async () => {
    try {
      const response = await axiosInstance.put(
        `${API_URL}/doctor/kyc/resubmit/${doctorId}`
      );

      if (response.status === 200) {
        setIsResubmitted(true);
      }
    } catch (error) {
      console.error("Error resubmitting KYC:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_URL}/doctor/rejection-reason/${doctorId}`
        );
        setRejectionReason(response.data.reason);
      } catch (error) {
        console.error("Error fetching rejection data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 via-gray-100 to-purple-100 py-10">
      {isResubmitted ? (
        <DoctorKyc />
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
            <h1 className="text-4xl font-bold text-red-500 mb-6">
              KYC Rejected
            </h1>
            <p className="text-lg text-gray-700 mb-4">
              Unfortunately, your KYC submission has been rejected. Please check
              the reason below and resubmit your application.
            </p>
            <div className="mb-6">
              <span className="text-md font-medium text-gray-800">
                Rejection Reason:
              </span>
              <p className="mt-2 text-gray-600 italic">{rejectionReason}</p>
            </div>
            <button
              onClick={handleResubmit}
              className="bg-gradient-to-r from-purple-500 to-[#572c52] text-white font-semibold text-lg py-2 px-6 rounded-lg shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              Resubmit KYC
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default KycRejectionStatus;