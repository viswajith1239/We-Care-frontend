import { useEffect, useState } from "react";
import { User } from "../../types/user";
import { getUsers, toggleUserBlockStatus } from "../../service/adminService";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
}

function UserListing() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
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

  const fetchUsers = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await getUsers(page, ITEMS_PER_PAGE);
      console.log("kkk", response);


      if (response.data && response.data.users && response.data.users.users && Array.isArray(response.data.users.users)) {
        setUsers(response.data.users.users);
        if (response.data.users.pagination) {
          setPaginationInfo(response.data.users.pagination);
        }
      } else {

        setUsers([]);
        console.warn("No users data received or users is not an array");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleBlockUnblock = async (userId: string, currentStatus: boolean) => {
    console.log("kkk", userId);

    try {
      const response = await toggleUserBlockStatus(userId, currentStatus)


      if (response.status === 200 && response.data) {
        const updatedUserStatus = response.data.data;
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, isBlocked: updatedUserStatus } : user
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
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="p-4 w-full flex justify-center">
      <div className="w-full max-w-5xl">
        {!users || users.length === 0 ? (
          <p className="text-gray-500 text-xl font-medium text-center">No users found.</p>
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
              {users && users.length > 0 && users.map((user, index) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-center">{((currentPage - 1) * ITEMS_PER_PAGE) + index + 1}</td>
                  <td className="px-6 py-4 text-center">{user.name}</td>
                  <td className="px-6 py-4 text-center">{user.email}</td>
                  <td className="px-6 py-4 text-center">{user.phone}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleBlockUnblock(user?.id, user.isBlocked)}
                      className={`px-4 py-2 text-white rounded font-medium transition ${user.isBlocked ? "bg-[#00897B] hover:bg-[#00766a]" : "bg-red-600 hover:bg-red-700"
                        }`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}


        {users && users.length > 0 && (
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

export default UserListing;