import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import ReusableTable from '../../components/userComponents/ResuableTable';
import { getPrescription, downloadPrescriptionPDF } from '../../service/userService';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalBookings: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
}

interface PrescriptionData {
  createdAt: string | number | Date;
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
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
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


  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const fetchPrescription = async (page: number = 1, search: string = '') => {
    if (!userId) return;

    setLoading(true);
    try {
      console.log("Fetching prescriptions with search:", search);
      
      const response = await getPrescription(userId, page, ITEMS_PER_PAGE, search);

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

  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      setCurrentPage(1);
      fetchPrescription(1, searchTerm);
    }, 500),
    [userId]
  );

  useEffect(() => {
    fetchPrescription(currentPage, searchQuery);
  }, [userId, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
    fetchPrescription(1, '');
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const headers = ['Doctor', 'Date','Medicine', 'Dosage', 'Frequency', 'Duration', 'Instructions', 'Action'];

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
         <td className="py-2 px-4 text-center">  {prescription.createdAt ? 
         new Date(prescription.createdAt).toLocaleDateString('en-GB') : 'N/A'}</td>
        <td className="py-2 px-4 text-center">{med.medicineName || 'N/A'}</td>
        <td className="py-2 px-4 text-center">{med.dosage || 'N/A'}</td>
        <td className="py-2 px-4 text-center">{med.frequency || 'N/A'}</td>
        <td className="py-2 px-4 text-center">{med.duration || 'N/A'}</td>
        <td className="py-2 px-4 text-center">{med.instruction || 'N/A'}</td>
        <td className="py-2 px-4 text-center">
          <button
            className={`px-3 py-1 rounded text-white ${
              downloadingId === prescription._id 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#00897B] hover:bg-[#00695C]'
            }`}
            onClick={() => handleDownload(prescription._id)}
            disabled={downloadingId === prescription._id}
          >
            {downloadingId === prescription._id ? 'Downloading...' : 'Download'}
          </button>
        </td>
      </tr>
    ));
  };

  const handleDownload = async (prescriptionId: string) => {
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }

    setDownloadingId(prescriptionId);
    
    try {
      await downloadPrescriptionPDF(prescriptionId, userId);
      toast.success('Prescription downloaded successfully!');
    } catch (error) {
      console.error('Error downloading prescription:', error);
      toast.error('Failed to download prescription. Please try again.');
    } finally {
      setDownloadingId(null);
    }
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
      
 
      <div className="mb-6 flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by doctor name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00897B] focus:border-transparent outline-none"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {prescriptionData.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No prescriptions found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery 
              ? `No prescriptions found matching "${searchQuery}". Try a different search term.`
              : "No prescriptions have been issued yet."
            }
          </p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default Prescription;