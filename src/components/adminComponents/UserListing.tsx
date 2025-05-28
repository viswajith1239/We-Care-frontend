import { useEffect, useState } from "react";
import adminAxiosInstance from "../../axios/adminAxiosInstance";
import { User } from "../../types/user";

function UserListing() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await adminAxiosInstance.get(`/admin/users`);
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

  const handleBlockUnblock = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await adminAxiosInstance.patch(`/admin/${userId}/block-unblock`, {
        status: !currentStatus,
      });

      if (response.status === 200 && response.data) {
        const updatedUserStatus = response.data.data;
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isBlocked: updatedUserStatus } : user
          )
        );
      } else {
        console.error("Failed to update user status");
      }
    } catch (error) {
      console.error("Error in block-unblock:", error);
    }
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-4 w-full flex justify-center">
      <div className="w-full max-w-5xl">
        {users.length === 0 ? (
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
              {currentUsers.map((user, index) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 text-center">{indexOfFirstItem + index + 1}</td>
                  <td className="px-6 py-4 text-center">{user.name}</td>
                  <td className="px-6 py-4 text-center">{user.email}</td>
                  <td className="px-6 py-4 text-center">{user.phone}</td>
                  <td className="px-6 py-4 text-center">
                    {/* <span
                      className={`inline-block mr-3 font-medium ${
                        user.isBlocked ? "text-red-500" : "text-green-600"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span> */}
                    <button
                      onClick={() => handleBlockUnblock(user._id, user.isBlocked)}
                      className={`px-4 py-2 text-white rounded font-medium transition ${
                        user.isBlocked ? "bg-[#00897B] hover:bg-[#00766a]" : "bg-red-600 hover:bg-red-700"
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

       
        {users.length > 0 && (
  <div className="flex justify-between items-center space-x-2 mt-4">
    <button
      className={`px-6 py-2 rounded-lg ${
        currentPage === 1
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#00897B] text-white"
      }`}
      onClick={() => handlePageChange(currentPage - 1)}
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
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>
)}

      </div>
    </div>
  );
}

export default UserListing;
