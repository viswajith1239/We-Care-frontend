import { useEffect, useState, useCallback } from "react";
import { Doctor } from "../../types/doctor";
import { getDoctors, toggleDoctorBlockStatus } from "../../service/adminService";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
}

function DoctorListing() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    limit: 5
  });
  const ITEMS_PER_PAGE = 5;


  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const fetchDoctors = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      console.log("Search query:", search);
   
      const response = await getDoctors(page, ITEMS_PER_PAGE, search);

      if (response.data && response.data.doctors && response.data.doctors.doctors && Array.isArray(response.data.doctors.doctors)) {
        setDoctors(response.data.doctors.doctors);
        if (response.data.doctors.pagination) {
          setPaginationInfo(response.data.doctors.pagination);
        }
      } else {
        setDoctors([]);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      setCurrentPage(1);
      fetchDoctors(1, searchTerm);
    }, 500),
    []
  );

  useEffect(() => {
    fetchDoctors(currentPage, searchQuery);
  }, [currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
    fetchDoctors(1, '');
  };

  const handleBlockUnblock = async (doctorId: string, currentStatus: boolean) => {
    console.log("kkk", doctorId);

    try {
      const response = await toggleDoctorBlockStatus(doctorId, currentStatus);

      if (response.status === 200 && response.data) {
        const updatedDoctorStatus = response.data.data;
        setDoctors((prevUsers) =>
          prevUsers.map((doctor) =>
            doctor.id === doctorId ? { ...doctor, isBlocked: updatedDoctorStatus } : doctor
          )
        );
      } else {
        console.error("Failed to update user status");
      }
    } catch (error) {
      console.error("Error in block-unblock:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="p-4 w-full flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Doctor Management</h2>

      
        <div className="mb-6 flex justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by doctor name or email..."
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

        {!doctors || doctors.length === 0 ? (
          <p className="text-gray-500 text-xl font-medium text-center">
            {searchQuery
              ? `No doctors found matching "${searchQuery}". Try a different search term.`
              : "No doctors found."
            }
          </p>
        ) : (
          <table className="w-full border border-gray-200 divide-y divide-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider bg-[#00897B] bg-opacity-80">Serial No.</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider bg-[#00897B] bg-opacity-80">Name</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider bg-[#00897B] bg-opacity-80">Email</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider bg-[#00897B] bg-opacity-80">Phone</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider bg-[#00897B] bg-opacity-80">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {doctors && doctors.length > 0 && doctors.map((doctor, index) => (
                <tr key={doctor.id}>
                  <td className="px-6 py-4 text-center">{((currentPage - 1) * ITEMS_PER_PAGE) + index + 1}</td>
                  <td className="px-6 py-4 text-center">{doctor.name}</td>
                  <td className="px-6 py-4 text-center">{doctor.email}</td>
                  <td className="px-6 py-4 text-center">{doctor.phone}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleBlockUnblock(doctor?.id, doctor.isBlocked)}
                      className={`px-4 py-2 text-white rounded font-medium transition ${doctor.isBlocked ? "bg-[#00897B] hover:bg-[#00766a]" : "bg-red-600 hover:bg-red-700"
                        }`}
                    >
                      {doctor.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

   
        {doctors && doctors.length > 0 && (
          <div className="flex justify-center items-center mt-4">
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
        )}
      </div>
    </div>
  );
}

export default DoctorListing;