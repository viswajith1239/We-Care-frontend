import { useEffect, useState } from 'react';
import userAxiosInstance from '../../axios/userAxiosInstance';
import toast from 'react-hot-toast';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import API_URL from '../../axios/API_URL';
import jsPDF from 'jspdf';
import ReusableTable from '../../components/userComponents/ResuableTable'; // Adjust the import path as needed

function Prescription() {
  const [prescription, setPrescription] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const userId = userInfo?.id;
  const ITEMS_PER_PAGE = 3;

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const response = await userAxiosInstance.get(`${API_URL}/user/prescription/${userId}`);
        console.log("Prescription data:", response.data);
        setPrescription(response.data);
      } catch (err) {
        toast.error('Failed to fetch prescription.');
      }
    };

    if (userId) {
      fetchPrescription();
    }
  }, [userId]);

  const totalPages = Math.ceil(prescription.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPrescription = prescription.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const headers = ['Doctor', 'Medicine', 'Dosage', 'Frequency', 'Duration', 'Instructions', 'Action'];

  const renderRow = (prescription: any, index: number) => {
    return prescription.prescriptions.map((med: any, medIndex: number) => (
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
    const prescriptionData = prescription.find((p) => p._id === prescriptionId);
    if (!prescriptionData) return;

    const bookingData = prescriptionData.bookingData || {};
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
    pdf.text(`Dr. ${prescriptionData.doctorName || 'Unknown Doctor'}`, 20, yPosition);

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Consultation Fee: ${prescriptionData.bookingAmount || 'N/A'}`, 20, yPosition + 24);
    pdf.text(`Prescription ID: ${prescriptionData._id}`, pageWidth - 20, yPosition, { align: 'right' });
    pdf.text(`Booking ID: ${prescriptionData.bookingId || 'N/A'}`, pageWidth - 20, yPosition + 8, { align: 'right' });

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
    pdf.text(`Patient ID: ${prescriptionData.userId || 'N/A'}`, 20, yPosition);
    pdf.text(`Patient Name: ${prescriptionData.userName || 'N/A'}`, 20, yPosition + 8);
    pdf.text(
      `Consultation Date: ${new Date(prescriptionData.bookingDate || bookingData.bookingDate).toLocaleDateString()}`,
      20,
      yPosition + 16
    );
    pdf.text(`Prescribed on: ${new Date(prescriptionData.bookingDate).toLocaleDateString()}`, 20, yPosition + 24);

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
    if (prescriptionData.prescriptions && prescriptionData.prescriptions.length > 0) {
      prescriptionData.prescriptions.forEach((med: any, index: number) => {
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

    if (prescriptionData.patientAdvice) {
      yPosition += 10;
      pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      pdf.rect(15, yPosition - 5, pageWidth - 30, 15, 'F');
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PATIENT ADVICE', 20, yPosition + 5);

      yPosition += 20;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const adviceLines = pdf.splitTextToSize(prescriptionData.patientAdvice, pageWidth - 40);
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

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Your Prescriptions</h2>
      <ReusableTable
        headers={headers}
        data={paginatedPrescription}
        renderRow={renderRow}
        headerClassName="bg-[#00897B] text-white"
        emptyMessage="No prescriptions found."
      />
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
}

export default Prescription;