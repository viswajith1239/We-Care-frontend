import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import doctorAxiosInstance from '../../axios/doctorAxiosInstance';
import API_URL from '../../axios/API_URL';
import axios from 'axios';
import toast,{ Toaster }  from 'react-hot-toast';

interface Prescription {
  medicineName: string;
  description: string;
}

const DoctorPrescription: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([{ medicineName: '', description: '' }]);
  const [doctorPrescriptions, setDoctorPrescriptions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { doctorInfo } = useSelector((state: RootState) => state.doctor);
  const {userInfo}=useSelector((state:RootState)=>state.user)
  const doctorId = doctorInfo.id;
  const userId=userInfo?.id
  console.log("uuuu",userId);
  console.log("ddd",doctorId);
  const ITEMS_PER_PAGE = 3;
  
  

  const handleChange = (
    index: number,
    field: keyof Prescription,
    value: string
  ) => {
    const updated = [...prescriptions];
    updated[index][field] = value;
    setPrescriptions(updated);
  };

  const addPrescriptionField = () => {
    setPrescriptions([...prescriptions, { medicineName: '', description: '' }]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const response = await doctorAxiosInstance.post(`${API_URL}/doctor/prescription/${doctorId}/${userId}`, {     // replace with real one        // replace with logged-in user ID
        prescriptions
      });
  
      console.log('Response:', response.data);
      toast.success('Prescription submitted successfully!');
      setIsModalOpen(false);
      setPrescriptions([{ medicineName: '', description: '' }]);
    } catch (error) {
      console.error('Error submitting prescription:', error);
      toast.error('Failed to submit prescription.');
    }
  };

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await doctorAxiosInstance.get(`${API_URL}/doctor/prescriptions/${doctorId}`);
        console.log("fetchdeeeeee",response);
        
        setDoctorPrescriptions(response.data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      }
    };
  
    fetchPrescriptions();
  }, [doctorId])
  const totalPages = Math.ceil(doctorPrescriptions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPrescription = doctorPrescriptions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="p-6">
       <Toaster/>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-[#00897B] text-white px-4 py-2 rounded hover:bg-[#00897B]"
      >
        + Add Prescription
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
            {/* X Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-3 text-xl text-gray-600 hover:text-red-500"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold mb-4">Create Prescription</h2>

            <form onSubmit={handleSubmit}>
              {prescriptions.map((item, index) => (
                <div key={index} className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medicine Name
                  </label>
                  <input
                    type="text"
                    value={item.medicineName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange(index, 'medicineName', e.target.value)
                    }
                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                    required
                  />

                  <label className="block text-sm font-medium text-gray-700 mt-3 mb-1">
                    Description
                  </label>
                  <textarea
                    value={item.description}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      handleChange(index, 'description', e.target.value)
                    }
                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                    required
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addPrescriptionField}
                className="text-blue-600 hover:text-blue-800 mb-4"
              >
                {/* + Add another medicine */}
              </button>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-[#00897B] text-white px-4 py-2 rounded hover:bg-[#00897B]"
                >
                  Submit Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
     <div className="mt-10">
  <h2 className="text-xl font-semibold mb-4">Previous Prescriptions</h2>
  {paginatedPrescription.length === 0 ? (
    <p className="text-gray-600">No prescriptions found.</p>
  ) : (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full border-collapse rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-50">
            <th className="py-2 px-4 bg-[#00897B] text-white">Patient Name</th>
            <th className="py-2 px-4 bg-[#00897B] text-white">Medicine Name</th>
            <th className="py-2 px-4 bg-[#00897B] text-white">Description</th>
            <th className="py-2 px-4 bg-[#00897B] text-white">Date</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPrescription.map((prescription: any) =>
            prescription.prescriptions.map((med: any, index: number) => (
              <tr key={`${prescription._id}-${index}`} className="border-t">
                <td className="py-2 px-4 text-center">
                  {prescription.userId?.name || 'Unknown'}
                </td>
                <td className="py-2 px-4 text-center">{med.medicineName}</td>
                <td className="py-2 px-4 text-center">{med.description}</td>
                <td className="py-2 px-4 text-center">
                  {new Date(prescription.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  )}
</div>
<div className="flex justify-between items-center space-x-2 mt-4">
        <button
          className={`px-6 py-2 rounded-lg ${
            currentPage === 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#00897B] text-white"
          }`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="px-6 py-2 text-black font-bold">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className={`px-4 py-2 rounded-lg ${
            currentPage === totalPages
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#00897B] text-white"
          }`}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

    </div>
  );
};

export default DoctorPrescription;
