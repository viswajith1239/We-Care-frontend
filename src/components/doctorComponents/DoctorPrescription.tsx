import React, { useState, useEffect } from 'react';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { getPrescriptions } from '../../service/doctorService';

interface BookingDetail {
  startDate: string | number | Date;
  userId: { _id: string; name: string; email: string; phone: string };
  _id: string;
  startTime: string;
  endTime: string;
  paymentStatus: string;
  appoinmentStatus?: string;
  bookingDate: string;
}

interface Medicine {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instruction: string;
}

interface Prescription {
  _id: string;
  userId: { _id: string; name: string; email: string; phone: string };
  prescriptions: Medicine[];
  createdAt: string;
  doctorId?: string;
  symptoms?: string;
  diagnosis?: string;
  notes?: string;
}

const DoctorPrescription: React.FC = () => {
  const [doctorPrescriptions, setDoctorPrescriptions] = useState<Prescription[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const { doctorInfo } = useSelector((state: RootState) => state.doctor);
  const { userInfo } = useSelector((state: RootState) => state.user);

  const doctorId = doctorInfo.id;

  console.log("doctor info", doctorInfo);
  console.log("userinfoiiiii:", userInfo?.id);

  const ITEMS_PER_PAGE = 3;

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await getPrescriptions(doctorId)
        setDoctorPrescriptions(response.data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      }
    };

    fetchPrescriptions();
  }, [doctorId]);

  const handleViewClick = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPrescription(null);
  };

  const totalPages = Math.ceil(doctorPrescriptions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPrescription = doctorPrescriptions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="p-6">
      <Toaster />

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Medication history</h2>
        {paginatedPrescription.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No prescriptions found</h3>
            <p className="mt-1 text-sm text-gray-500">No medical prescriptions have been created yet.</p>
          </div>
        ) : (
          <>
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
                    <th className="py-2 px-4 bg-[#00897B] text-white">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPrescription.map((prescription: Prescription) =>
                    prescription.prescriptions.map((med: Medicine, index: number) => (
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
                        <td className="py-2 px-4 text-center">
                          {index === 0 && (
                            <button
                              onClick={() => handleViewClick(prescription)}
                              className="bg-[#00897B] hover:bg-[#00897B] text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
                            >
                              View
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center space-x-2 mt-4">
              <button
                className={`px-6 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00897B] text-white'
                  }`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span className="px-6 py-2 text-black font-bold">{`Page ${currentPage} of ${totalPages}`}</span>
              <button
                className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00897B] text-white'
                  }`}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>


      {isModalOpen && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 flex-1 text-center ">Medication Details</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>


            <div className="p-6">

              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">Patient Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <span className="ml-2 text-gray-900">{selectedPrescription.userId?.name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Doctor Name:</span>
                    <span className="ml-2 text-gray-900">{doctorInfo.name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <span className="ml-2 text-gray-900">{doctorInfo.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(selectedPrescription.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>


              {(selectedPrescription.symptoms || selectedPrescription.diagnosis || selectedPrescription.notes) && (
                <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3 text-gray-800">Clinical Information</h4>
                  {selectedPrescription.symptoms && (
                    <div className="mb-2">
                      <span className="font-medium text-gray-700">Symptoms:</span>
                      <p className="mt-1 text-gray-900">{selectedPrescription.symptoms}</p>
                    </div>
                  )}
                  {selectedPrescription.diagnosis && (
                    <div className="mb-2">
                      <span className="font-medium text-gray-700">Diagnosis:</span>
                      <p className="mt-1 text-gray-900">{selectedPrescription.diagnosis}</p>
                    </div>
                  )}
                  {selectedPrescription.notes && (
                    <div className="mb-2">
                      <span className="font-medium text-gray-700">Notes:</span>
                      <p className="mt-1 text-gray-900">{selectedPrescription.notes}</p>
                    </div>
                  )}
                </div>
              )}


              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">Prescribed Medicines</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">Medicine</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">Dosage</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">Frequency</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">Duration</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">Instructions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPrescription.prescriptions.map((medicine, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="py-3 px-4 border-b font-medium text-gray-900">{medicine.medicineName}</td>
                          <td className="py-3 px-4 border-b text-gray-700">{medicine.dosage}</td>
                          <td className="py-3 px-4 border-b text-gray-700">{medicine.frequency}</td>
                          <td className="py-3 px-4 border-b text-gray-700">{medicine.duration}</td>
                          <td className="py-3 px-4 border-b text-gray-700">{medicine.instruction}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-2 text-gray-800">Summary</h4>
                <p className="text-gray-700">
                  Total medicines prescribed: <span className="font-medium">{selectedPrescription.prescriptions.length}</span>
                </p>
                <p className="text-gray-700">
                  Prescription ID: <span className="font-medium font-mono text-sm">{selectedPrescription._id}</span>
                </p>
              </div>
            </div>


            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPrescription;