import { useEffect, useState } from 'react'
import userAxiosInstance from '../../axios/userAxiosInstance'
import toast from 'react-hot-toast'
import { RootState } from '../../app/store'
import { useSelector } from 'react-redux'
import API_URL from '../../axios/API_URL'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

function Prescription() {
  const [prescription, setPrescription] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const { userInfo } = useSelector((state: RootState) => state.user)
  const userId = userInfo?.id
  const ITEMS_PER_PAGE = 3

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const response = await userAxiosInstance.get(`${API_URL}/user/prescription/${userId}`)
        setPrescription(response.data)
      } catch (err) {
        toast.error('Failed to fetch prescription.')
      }
    }

    if (userId) {
      fetchPrescription()
    }
  }, [userId])

  const totalPages = Math.ceil(prescription.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedPrescription = prescription.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  )

  const handleDownload = (prescriptionId: string) => {
    const prescriptionData = prescription.find(p => p._id === prescriptionId)
    if (!prescriptionData) return

    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text("Prescription Details", 14, 20)

    doc.setFontSize(12)
    doc.text(`Doctor: ${prescriptionData.doctorId?.name || 'Unknown'}`, 14, 30)
    doc.text(`Date: ${new Date(prescriptionData.createdAt).toLocaleDateString()}`, 14, 38)

    const tableColumn = ["Medicine Name", "Description"]
    const tableRows = prescriptionData.prescriptions.map((med: any) => [
      med.medicineName,
      med.description
    ])

    autoTable(doc, {
      startY: 45,
      head: [tableColumn],
      body: tableRows
    })

    doc.save(`Prescription_${prescriptionId}.pdf`)
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Your Prescriptions</h2>
      {paginatedPrescription.length === 0 ? (
        <p className="text-gray-600">No prescriptions found.</p>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full border-collapse rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-4 bg-[#00897B] text-white">Doctor Name</th>
                  <th className="py-2 px-4 bg-[#00897B] text-white">Medicine Name</th>
                  <th className="py-2 px-4 bg-[#00897B] text-white">Description</th>
                  <th className="py-2 px-4 bg-[#00897B] text-white">Date</th>
                  <th className="py-2 px-4 bg-[#00897B] text-white">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPrescription.map((prescription: any) =>
                  prescription.prescriptions.map((med: any, index: number) => (
                    <tr key={`${prescription._id}-${index}`} className="border-t">
                      <td className="py-2 px-4 text-center">
                        {prescription.doctorId?.name || 'Unknown'}
                      </td>
                      <td className="py-2 px-4 text-center">{med.medicineName}</td>
                      <td className="py-2 px-4 text-center">{med.description}</td>
                      <td className="py-2 px-4 text-center">
                        {new Date(prescription.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <button
                          className="bg-[#00897B] text-white px-3 py-1 rounded hover:bg-[#00695C]"
                          onClick={() => handleDownload(prescription._id)}
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center space-x-2 mt-4">
            <button
              className={`px-6 py-2 rounded-lg ${
                currentPage === 1
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#00897B] text-white'
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="px-6 py-2 text-black font-bold">
              {`Page ${currentPage} of ${totalPages}`}
            </span>
            <button
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#00897B] text-white'
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
  )
}

export default Prescription
