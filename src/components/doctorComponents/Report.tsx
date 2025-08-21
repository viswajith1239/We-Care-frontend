import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import toast from "react-hot-toast";
import { getreports } from "../../service/doctorService";

interface ReportData {
  _id: string;
  imageUrl: string;
  createdAt?: string;
  userId?: string;
  userName?: string;
  patientId?: string;
  patientName?: string;
  user?: {
    _id: string;
    name: string;
    email?: string;
  };
}

interface GroupedReportData {
  patientId: string;
  patientName: string;
  reports: ReportData[];
  totalReports: number;
  lastUpload?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalReports: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
}

function Report() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [groupedReports, setGroupedReports] = useState<GroupedReportData[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedUserReports, setSelectedUserReports] = useState<ReportData[]>([]);
  const [selectedUserName, setSelectedUserName] = useState<string>("");
  const [fullImageModal, setFullImageModal] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalReports: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    limit: 5
  });

  const { doctorInfo } = useSelector((state: RootState) => state.doctor);
  const ITEMS_PER_PAGE = 5;

  // Debounced search function
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const fetchReports = async (page: number = 1, search: string = '') => {
  if (!doctorInfo || !doctorInfo.id) return;
  
  try {
    setIsLoadingReports(true);
    console.log("Fetching reports with search:", search, "page:", page);

    const response = await getreports(doctorInfo.id, page, ITEMS_PER_PAGE, search);
    console.log("Full response:", response);
    console.log("Response data:", response.data);

    if (response.data && response.status === 200) {
   
      const reportsData = response.data.reports;
      
    
      if (reportsData && reportsData.reports && Array.isArray(reportsData.reports)) {
        console.log("Setting individual reports:", reportsData.reports.length);
        setReports(reportsData.reports);
      } else {
        console.log("No individual reports found or not an array");
        setReports([]);
      }
      
  
      if (reportsData && reportsData.groupedReports && Array.isArray(reportsData.groupedReports)) {
        console.log("Processing grouped reports:", reportsData.groupedReports.length);
        
 
        const mergedGroupsMap = new Map();
        
        reportsData.groupedReports.forEach((group: GroupedReportData) => {
          const patientId = group.patientId;
          
          if (mergedGroupsMap.has(patientId)) {
         
            const existingGroup = mergedGroupsMap.get(patientId);
            existingGroup.reports = [...existingGroup.reports, ...group.reports];
            existingGroup.totalReports = existingGroup.reports.length;
    
            const allDates = [...existingGroup.reports, ...group.reports]
              .map(report => new Date(report.createdAt || 0))
              .filter(date => !isNaN(date.getTime()));
            
            if (allDates.length > 0) {
              existingGroup.lastUpload = new Date(Math.max(...allDates.map(d => d.getTime()))).toISOString();
            }
          } else {
          
            mergedGroupsMap.set(patientId, {
              patientId: group.patientId,
              patientName: group.patientName,
              reports: [...group.reports],
              totalReports: group.reports.length,
              lastUpload: group.lastUpload
            });
          }
        });
        
  
        const mergedGroupedReports = Array.from(mergedGroupsMap.values());
        mergedGroupedReports.sort((a, b) => {
          if (!a.lastUpload && !b.lastUpload) return 0;
          if (!a.lastUpload) return 1;
          if (!b.lastUpload) return -1;
          return new Date(b.lastUpload).getTime() - new Date(a.lastUpload).getTime();
        });
        
        console.log("Merged grouped reports:", mergedGroupedReports.length);
        console.log("Sample merged group:", mergedGroupedReports[0]);
        setGroupedReports(mergedGroupedReports);
      } else {
        console.log("No grouped reports found or not an array");
        setGroupedReports([]);
      }

      
      if (reportsData && reportsData.pagination) {
        console.log("Setting pagination:", reportsData.pagination);
        setPaginationInfo(reportsData.pagination);
      } else {
        
        setPaginationInfo({
          currentPage: page,
          totalPages: 1,
          totalReports: reportsData?.groupedReports?.length || 0,
          hasNextPage: false,
          hasPreviousPage: false,
          limit: ITEMS_PER_PAGE
        });
      }
    } else {
      console.log("Invalid response or status");
      setReports([]);
      setGroupedReports([]);
      setPaginationInfo({
        currentPage: 1,
        totalPages: 1,
        totalReports: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        limit: ITEMS_PER_PAGE
      });
    }
  } catch (error) {
    console.error("Error fetching reports:", error);
    toast.error("Failed to load reports");
    setReports([]);
    setGroupedReports([]);
    setPaginationInfo({
      currentPage: 1,
      totalPages: 1,
      totalReports: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      limit: ITEMS_PER_PAGE
    });
  } finally {
    setIsLoadingReports(false);
  }
};

  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      setCurrentPage(1);
      fetchReports(1, searchTerm);
    }, 500),
    [doctorInfo]
  );

  useEffect(() => {
    fetchReports(currentPage, searchQuery);
  }, [doctorInfo, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
    fetchReports(1, '');
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleViewReports = (userReports: ReportData[], userName: string) => {
    setSelectedUserReports(userReports);
    setSelectedUserName(userName);
    setShowModal(true);
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setFullImageModal(true);
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUserReports([]);
    setSelectedUserName("");
  };

  const closeImageModal = () => {
    setFullImageModal(false);
    setSelectedImage("");
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Medical Reports</h1>

   
      <div className="mb-6 flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by patient name or ID..."
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

      {isLoadingReports ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-500">Loading reports...</p>
        </div>
      ) : reports.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 rounded-lg border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium bg-[#00897B] text-white text-center uppercase tracking-wider">
                    Patient Id
                  </th>
                  <th className="px-6 py-3 bg-[#00897B] text-white text-center text-xs font-medium uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-3 bg-[#00897B] text-white text-center text-xs font-medium uppercase tracking-wider">
                    Total Reports
                  </th>
                  <th className="px-6 py-3 text-xs font-medium bg-[#00897B] text-white text-center uppercase tracking-wider">
                    Last Upload
                  </th>
                  <th className="px-6 py-3 text-xs font-medium bg-[#00897B] text-white text-center uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {groupedReports.map((group, index) => (
                  <tr key={group.patientId || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">ID: {group.patientId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{group.patientName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {group.totalReports} reports
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {group.lastUpload
                        ? new Date(group.lastUpload).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                        : 'No uploads'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewReports(group.reports, group.patientName)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#00897B] hover:bg-[#00897B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        View Reports
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

     
          <div className="flex justify-center items-center mt-6">
            <div className="flex items-center space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!paginationInfo.hasPreviousPage}
              >
                Previous
              </button>
              <span className="px-4 py-2 text-black font-bold text-center">
                Page {paginationInfo.currentPage} of {paginationInfo.totalPages}
              </span>
              <button
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!paginationInfo.hasNextPage}
              >
                Next
              </button>
            </div>
          </div>

         
        </>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? `No reports found matching "${searchQuery}". Try a different search term.`
              : "No medical reports have been uploaded yet."
            }
          </p>
        </div>
      )}


      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedUserName}'s Medical Reports
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {selectedUserReports.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {selectedUserReports.map((report) => (
                  <div key={report._id} className="bg-gray-100 p-3 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
                    <img
                      src={report.imageUrl}
                      alt="Medical Report"
                      className="w-full h-32 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity duration-200"
                      onClick={() => handleImageClick(report.imageUrl)}
                    />
                    {report.createdAt && (
                      <p className="text-xs text-gray-600 mt-2 text-center">
                        {new Date(report.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No reports available for this user.</p>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      
      {fullImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={closeImageModal}
              className="absolute top-2 right-2 text-white hover:text-gray-300 text-3xl font-bold z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt="Full Medical Report"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Report;