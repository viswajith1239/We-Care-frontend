import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import doctorAxiosInstance from '../../axios/doctorAxiosInstance';
import API_URL from '../../axios/API_URL';
import toast, { Toaster } from 'react-hot-toast';

interface Prescription {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instruction: string;
}

const DoctorPrescription: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([{
    medicineName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instruction: ''
  }]);
  const [doctorPrescriptions, setDoctorPrescriptions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { doctorInfo } = useSelector((state: RootState) => state.doctor);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const doctorId = doctorInfo.id;
  const userId = userInfo?.id;

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
    setPrescriptions([
      ...prescriptions,
      {
        medicineName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instruction: ''
      }
    ]);
  };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        const response = await doctorAxiosInstance.post(`${API_URL}/doctor/prescription/${doctorId}/${userId}`, {
          prescriptions
        });

        toast.success('Prescription submitted successfully!');
        setIsModalOpen(false);
        setPrescriptions([{
          medicineName: '',
          dosage: '',
          frequency: '',
          duration: '',
          instruction: ''
        }]);
      } catch (error) {
        console.error('Error submitting prescription:', error);
        toast.error('Failed to submit prescription.');
      }
    };

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await doctorAxiosInstance.get(`${API_URL}/doctor/prescriptions/${doctorId}`);
        setDoctorPrescriptions(response.data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      }
    };

    fetchPrescriptions();
  }, [doctorId]);

  const totalPages = Math.ceil(doctorPrescriptions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPrescription = doctorPrescriptions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="p-6">
      <Toaster />

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Previous Prescriptions</h2>
        {paginatedPrescription.length === 0 ? (
          <p className="text-gray-600">No prescriptions found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full border-collapse rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-4 bg-[#00897B] text-white">Patient Name</th>
                  <th className="py-2 px-4 bg-[#00897B] text-white">Medicine</th>
                  <th className="py-2 px-4 bg-[#00897B] text-white">Dosage</th>
                  <th className="py-2 px-4 bg-[#00897B] text-white">Frequency</th>
                  <th className="py-2 px-4 bg-[#00897B] text-white">Duration</th>
                  <th className="py-2 px-4 bg-[#00897B] text-white">Instruction</th>
                  <th className="py-2 px-4 bg-[#00897B] text-white">Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPrescription.map((prescription: any) =>
                  prescription.prescriptions.map((med: any, index: number) => (
                    <tr key={`${prescription._id}-${index}`} className="border-t">
                      <td className="py-2 px-4 text-center">{prescription.userId?.name || 'Unknown'}</td>
                      <td className="py-2 px-4 text-center">{med.medicineName}</td>
                      <td className="py-2 px-4 text-center">{med.dosage}</td>
                      <td className="py-2 px-4 text-center">{med.frequency}</td>
                      <td className="py-2 px-4 text-center">{med.duration}</td>
                      <td className="py-2 px-4 text-center">{med.instruction}</td>
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
            currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00897B] text-white'
          }`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="px-6 py-2 text-black font-bold">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className={`px-4 py-2 rounded-lg ${
            currentPage === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00897B] text-white'
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
