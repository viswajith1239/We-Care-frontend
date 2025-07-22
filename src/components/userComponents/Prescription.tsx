import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import jsPDF from 'jspdf';
import ReusableTable from '../../components/userComponents/ResuableTable';
import { getPrescription } from '../../service/userService';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalBookings: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
}

interface PrescriptionData {
  _id: string;
  doctorName: string;
  userId: string;
  userName: string;
  bookingId: string;
  bookingDate: string;
  bookingAmount: string;
  prescriptions: Array<{
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instruction: string;
  }>;
  patientAdvice?: string;
  bookingData?: any;
}

function Prescription() {
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useSelector((state: RootState) => state.user);

  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    limit: 3
  });

  const userId = userInfo?.id;
  const ITEMS_PER_PAGE = 3;

  useEffect(() => {
    const fetchPrescription = async (page: number = 1) => {
      if (!userId) return;

      setLoading(true);
      try {
        const response = await getPrescription(userId, page, ITEMS_PER_PAGE)

        console.log("Full API response:", response.data);


        if (response.data) {

          if (response.data.prescriptions && Array.isArray(response.data.prescriptions)) {
            setPrescriptionData(response.data.prescriptions);
            setPaginationInfo(response.data.pagination || {
              currentPage: page,
              totalPages: 1,
              totalBookings: response.data.prescriptions.length,
              hasNextPage: false,
              hasPreviousPage: false,
              limit: ITEMS_PER_PAGE
            });
          }

          else if (Array.isArray(response.data)) {
            setPrescriptionData(response.data);
            setPaginationInfo({
              currentPage: page,
              totalPages: Math.ceil(response.data.length / ITEMS_PER_PAGE),
              totalBookings: response.data.length,
              hasNextPage: page < Math.ceil(response.data.length / ITEMS_PER_PAGE),
              hasPreviousPage: page > 1,
              limit: ITEMS_PER_PAGE
            });
          }

          else if (response.data.data && Array.isArray(response.data.data)) {
            setPrescriptionData(response.data.data);
            setPaginationInfo(response.data.pagination || {
              currentPage: page,
              totalPages: 1,
              totalBookings: response.data.data.length,
              hasNextPage: false,
              hasPreviousPage: false,
              limit: ITEMS_PER_PAGE
            });
          }

          else if (response.data.pagination) {
            setPrescriptionData(response.data.prescriptions || []);
            setPaginationInfo(response.data.pagination);
          }
          else {

            setPrescriptionData([]);
            setPaginationInfo({
              currentPage: 1,
              totalPages: 1,
              totalBookings: 0,
              hasNextPage: false,
              hasPreviousPage: false,
              limit: ITEMS_PER_PAGE
            });
          }
        } else {
          setPrescriptionData([]);
        }

      } catch (err) {
        console.error("Error fetching prescriptions:", err);
        toast.error('Failed to fetch prescription.');
        setPrescriptionData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription(currentPage);
  }, [userId, currentPage]);

  const headers = ['Doctor', 'Medicine', 'Dosage', 'Frequency', 'Duration', 'Instructions', 'Action'];

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= paginationInfo.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderRow = (prescription: PrescriptionData, index: number) => {

    const prescriptions = Array.isArray(prescription.prescriptions) ? prescription.prescriptions : [];

    return prescriptions.map((med: any, medIndex: number) => (
      <tr key={`${prescription._id}-${medIndex}`} className="border-t hover:bg-gray-50">
        <td className="py-2 px-4 text-center">{prescription.doctorName || 'Unknown'}</td>
        <td className="py-2 px-4 text-center">{med.medicineName || 'N/A'}</td>
        <td className="py-2 px-4 text-center">{med.dosage || 'N/A'}</td>
        <td className="py-2 px-4 text-center">{med.frequency || 'N/A'}</td>
        <td className="py-2 px-4 text-center">{med.duration || 'N/A'}</td>
        <td className="py-2 px-4 text-center">{med.instruction || 'N/A'}</td>
        <td className="py-2 px-4 text-center">
          <button
            className="bg-[#00897B] text-white px-3 py-1 rounded hover:bg-[#00695C]"
            onClick={() => handleDownload(prescription._id)}
          >
            Download
          </button>
        </td>
      </tr>
    ));
  };

  const handleDownload = (prescriptionId: string) => {
    const prescriptionDataItem = prescriptionData.find((p) => p._id === prescriptionId);
    if (!prescriptionDataItem) return;

    const bookingData = prescriptionDataItem.bookingData || {};
    const pdf = new jsPDF({
      unit: 'mm',
      format: [250, 297],
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const textColor = [51, 51, 51];
    const lightGray = [240, 240, 240];
    const borderColor = [200, 200, 200];

    pdf.setFillColor(0, 137, 123);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(36);
    pdf.setFont('helvetica', 'bold');
    const centerX = pageWidth / 2;
    pdf.text('WeCare', centerX, 25, { align: 'center' });

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    pdf.text(`Date: ${currentDate}`, pageWidth - 20, 25, { align: 'right' });

    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);

    let yPosition = 60;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Dr. ${prescriptionDataItem.doctorName || 'Unknown Doctor'}`, 20, yPosition);

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Consultation Fee: ${prescriptionDataItem.bookingAmount || 'N/A'}`, 20, yPosition + 24);
    pdf.text(`Prescription ID: ${prescriptionDataItem._id}`, pageWidth - 20, yPosition, { align: 'right' });
    pdf.text(`Booking ID: ${prescriptionDataItem.bookingId || 'N/A'}`, pageWidth - 20, yPosition + 8, { align: 'right' });

    yPosition += 40;
    pdf.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    pdf.setLineWidth(0.5);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);

    yPosition += 20;
    pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    pdf.rect(15, yPosition - 5, pageWidth - 30, 15, 'F');
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PRESCRIPTION', 20, yPosition + 5);

    yPosition += 20;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Patient ID: ${prescriptionDataItem.userId || 'N/A'}`, 20, yPosition);
    pdf.text(`Patient Name: ${prescriptionDataItem.userName || 'N/A'}`, 20, yPosition + 8);
    pdf.text(
      `Consultation Date: ${new Date(prescriptionDataItem.bookingDate || bookingData.bookingDate).toLocaleDateString()}`,
      20,
      yPosition + 16
    );
    pdf.text(`Prescribed on: ${new Date(prescriptionDataItem.bookingDate).toLocaleDateString()}`, 20, yPosition + 24);

    yPosition += 35;
    pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    pdf.rect(15, yPosition - 5, pageWidth - 30, 15, 'F');
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('MEDICATIONS', 20, yPosition + 5);

    yPosition += 20;
    const instructionsX = 180;
    const instructionsWidth = pageWidth - instructionsX - 20;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Medicine', 20, yPosition);
    pdf.text('Dosage', 60, yPosition);
    pdf.text('Frequency', 100, yPosition);
    pdf.text('Duration', 140, yPosition);
    pdf.text('Instructions', instructionsX, yPosition);
    pdf.setLineWidth(0.3);
    pdf.line(20, yPosition + 2, pageWidth - 20, yPosition + 2);

    yPosition += 12;
    pdf.setFont('helvetica', 'normal');
    if (prescriptionDataItem.prescriptions && prescriptionDataItem.prescriptions.length > 0) {
      prescriptionDataItem.prescriptions.forEach((med: any, index: number) => {
        if (index % 2 === 0) {
          pdf.setFillColor(250, 250, 250);
          pdf.rect(15, yPosition - 4, pageWidth - 30, 12, 'F');
        }
        pdf.text(med.medicineName || 'N/A', 20, yPosition);
        pdf.text(med.dosage || 'N/A', 60, yPosition);
        pdf.text(med.frequency?.toString() || 'N/A', 100, yPosition);
        pdf.text(med.duration || 'N/A', 140, yPosition);
        const instructions = pdf.splitTextToSize(med.instruction || 'As directed', instructionsWidth);
        pdf.text(instructions, instructionsX, yPosition);
        yPosition += 15 + (instructions.length - 1) * 6;
      });
    } else {
      pdf.text('No medications prescribed', 20, yPosition);
      yPosition += 15;
    }

    if (prescriptionDataItem.patientAdvice) {
      yPosition += 10;
      pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      pdf.rect(15, yPosition - 5, pageWidth - 30, 15, 'F');
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PATIENT ADVICE', 20, yPosition + 5);

      yPosition += 20;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const adviceLines = pdf.splitTextToSize(prescriptionDataItem.patientAdvice, pageWidth - 40);
      pdf.text(adviceLines, 20, yPosition);
      yPosition += adviceLines.length * 5;
    }

    yPosition = pageHeight - 60;
    pdf.setLineWidth(0.5);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    pdf.setFontSize(10);
    pdf.text("Doctor's Signature", pageWidth - 80, yPosition + 8);

    yPosition += 25;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Important: Take medications as prescribed. Contact your doctor if you experience any adverse effects.', 20, yPosition);
    pdf.text('This prescription is valid for 30 days from the date of issue.', 20, yPosition + 8);

    const filename = `Prescription_${prescriptionId}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
  };

  if (loading) {
    return (
      <div className="mt-10 flex justify-center items-center">
        <div className="text-lg">Loading prescriptions...</div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Your Prescriptions</h2>
      <ReusableTable
        headers={headers}
        data={prescriptionData}
        renderRow={renderRow}
        headerClassName="bg-[#00897B] text-white"
        emptyMessage="No prescriptions found."
      />
      <div className="flex justify-between items-center space-x-2 mt-4">
        <button
          className={`px-6 py-2 rounded-lg ${!paginationInfo.hasPreviousPage ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00897B] text-white'
            }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!paginationInfo.hasPreviousPage}
        >
          Prev
        </button>
        <span className="px-6 py-2 text-black font-bold">
          {`Page ${paginationInfo.currentPage} of ${paginationInfo.totalPages}`}
        </span>
        <button
          className={`px-4 py-2 rounded-lg ${!paginationInfo.hasNextPage ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00897B] text-white'
            }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!paginationInfo.hasNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Prescription;