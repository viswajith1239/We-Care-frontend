import  { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import userAxiosInstance from "../../axios/userAxiosInstance";
import API_URL from "../../axios/API_URL";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { getWalletData } from "../../service/userService";

interface ITransaction {
  transactionId: string;
  transactionType: "credit" | "debit";
  amount: number;
  date: string;
  description: string;
}

interface IWallet {
  balance: number;
  transactions: ITransaction[];
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalTransactions: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
}

function PatientWallet() {
  const [walletData, setWalletData] = useState<IWallet | null>(null);
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [addMoney, setAddMoney] = useState<{ amount: string | null }>({ amount: null });
  const [loading, setLoading] = useState<boolean>(true);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalTransactions: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    limit: 5
  });

  const ITEMS_PER_PAGE = 5;


  const fetchWalletData = async (page: number = 1) => {
    try {
      setLoading(true);
      if (!userInfo?.id) return;
      const response = await getWalletData(userInfo.id, page, ITEMS_PER_PAGE);

      console.log('Wallet data:', response);

      if (response.data) {
        setWalletData(response.data.walletData);
        setPaginationInfo(response.data.pagination);
      } else {

        setWalletData(response.data);

        setPaginationInfo({
          currentPage: page,
          totalPages: 1,
          totalTransactions: response.data?.transactions?.length || 0,
          hasNextPage: false,
          hasPreviousPage: false,
          limit: ITEMS_PER_PAGE
        });
      }
    } catch (error) {
      console.log('Error fetching wallet data:', error);

      setWalletData({
        balance: 0,
        transactions: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.id) {
      fetchWalletData(currentPage);
    }
  }, [userInfo?.id, currentPage]);

 

  const handleAddMoney = async () => {
    const amount = addMoney.amount ?? "";
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount to add.");
      return;
    }

    try {

      const response = await userAxiosInstance.post(
        `${API_URL}/user/add-money`,
        {
          userId: userInfo?.id,
          amount: parseFloat(amount)
        }
      );

      if (response.data.success) {
        alert("Money added successfully!");
        await fetchWalletData(currentPage);
        setIsAddMoneyModalOpen(false);
        setAddMoney({ amount: null });
      } else {
        alert("Failed to add money. Please try again.");
      }

    } catch (error) {
      console.log('Error adding money:', error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading wallet data...</div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-gray-50 min-h-screen">
      <Toaster />


      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Wallet</h1>
        <p className="text-gray-600">Manage your payments and transactions</p>
      </div>


      <div className="bg-white p-6 shadow-md rounded-lg mb-6">
        <h2 className="text-center text-lg font-semibold text-gray-700 mb-2">Available Balance</h2>
        <h3 className="text-center text-4xl font-bold text-green-600 mb-4">
          ₹{walletData?.balance?.toFixed(2) || "0.00"}
        </h3>
        {/* <div className="flex justify-center space-x-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            onClick={handleAddMoneyButton}
          >
            Add Money
          </button>
         
        </div> */}
      </div>


      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>

        </div>

        <div className="p-4">
          {walletData?.transactions?.length ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700">
                        Transaction ID
                      </th>

                      <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700">
                        Type
                      </th>
                      <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700">
                        Amount
                      </th>
                      <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {walletData.transactions.map((tx) => (
                      <tr key={tx.transactionId} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-3 text-sm text-gray-800">
                          {tx.transactionId}
                        </td>

                        <td className={`border border-gray-300 p-3 text-sm font-medium ${tx.transactionType === "credit" ? "text-green-600" : "text-red-600"
                          }`}>
                          <span className={`px-2 py-1 rounded-full text-xs ${tx.transactionType === "credit"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                            }`}>
                            {tx.transactionType.toUpperCase()}
                          </span>
                        </td>
                        <td className={`border border-gray-300 p-3 text-sm font-medium ${tx.transactionType === "credit" ? "text-green-600" : "text-red-600"
                          }`}>
                          {tx.transactionType === "credit" ? "+" : "-"}₹{tx.amount.toFixed(2)}
                        </td>
                        <td className="border border-gray-300 p-3 text-sm text-gray-600">
                          {new Date(tx.date).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>


              <div className="flex justify-center items-center mt-6">
                <div className="flex items-center space-x-2">
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!paginationInfo.hasPreviousPage}
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-700 font-medium">
                    Page {paginationInfo.currentPage} of {paginationInfo.totalPages}
                  </span>
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!paginationInfo.hasNextPage}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No transactions found.</p>
              <p className="text-gray-400 text-sm mt-2">
                Start using your wallet to see transaction history here.
              </p>
            </div>
          )}
        </div>
      </div>

      {isAddMoneyModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px]">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Money to Wallet</h2>
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={addMoney.amount ?? ""}
                  onChange={(e) => setAddMoney({ amount: e.target.value })}
                  placeholder="Enter amount"
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  onClick={() => setIsAddMoneyModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={handleAddMoney}
                >
                  Add Money
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientWallet;