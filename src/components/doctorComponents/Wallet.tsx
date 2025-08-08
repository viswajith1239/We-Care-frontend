import React, { useState, useEffect } from "react";
import { IWallet } from "../../types/doctor";
import toast, { Toaster } from "react-hot-toast";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { getWalletData, withdrawMoneydoctor } from "../../service/doctorService";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalTransactions: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
}

function Wallet() {
  const [walletData, setWalletData] = useState<IWallet | null>(null);
  const { doctorInfo } = useSelector((state: RootState) => state.doctor);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawMoney, setWithdrawMoney] = useState<{ amount: string | null }>({ amount: null });
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalTransactions: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    limit: 3
  });

  const ITEMS_PER_PAGE = 3;

  const fetchWalletData = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await getWalletData(doctorInfo.id, page, ITEMS_PER_PAGE)

      console.log('Wallet data:', response);

      if (response.data) {
        setWalletData(response.data.walletData);
        setPaginationInfo(response.data.pagination);
      } else {
        setWalletData(response.data);
      }
    } catch (error) {
      console.log('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData(currentPage);
  }, [doctorInfo.id, currentPage]);

  const handleWithdrawButton = () => {
    setIsModalOpen(true);
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = withdrawMoney.amount ?? "";
    if (!amount || parseFloat(amount) <= 0) {
      toast("Please enter a valid amount to withdraw.");
      return;
    }

    try {
      const response = await withdrawMoneydoctor(doctorInfo.id, parseFloat(amount));

      if (response.status === 200) {
        toast.success("Money withdrawal successful.");
        await fetchWalletData(currentPage);
        setIsModalOpen(false);
        setWithdrawMoney({ amount: null });
      } else {
        toast.error("Withdrawal request failed. Please try again.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred. Please try again later.");
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-sm sm:text-base">Loading wallet data...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6 bg-gray-50 min-h-screen">
      <Toaster />
      
    
      <div className="bg-white p-4 sm:p-6 shadow-sm sm:shadow rounded-lg mb-4 sm:mb-6 max-w-4xl mx-auto">
        <h2 className="text-center text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3">Wallet Balance</h2>
        <h3 className="text-center text-2xl sm:text-3xl lg:text-4xl text-green-600 font-bold mb-4 sm:mb-6">
          Rs.{walletData?.balance}
        </h3>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium block mx-auto transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          onClick={handleWithdrawButton}
        >
          Withdraw Money
        </button>
      </div>

  
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4">Transaction History</h2>
        
        <div className="bg-white p-3 sm:p-4 lg:p-6 shadow-sm sm:shadow rounded-lg">
          {walletData?.transactions?.length ? (
            <>

              <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2 sm:p-3 text-sm sm:text-base font-medium">Transaction ID</th>
                        <th className="border border-gray-300 p-2 sm:p-3 text-sm sm:text-base font-medium">Type</th>
                        <th className="border border-gray-300 p-2 sm:p-3 text-sm sm:text-base font-medium">Amount</th>
                        <th className="border border-gray-300 p-2 sm:p-3 text-sm sm:text-base font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {walletData.transactions.map((tx) => (
                        <tr key={tx.transactionId} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">{tx.transactionId}</td>
                          <td className={`border border-gray-300 p-2 sm:p-3 text-xs sm:text-sm font-medium capitalize ${
                            tx.transactionType === "credit" ? "text-green-600" : "text-red-600"
                          }`}>
                            {tx.transactionType}
                          </td>
                          <td className="border border-gray-300 p-2 sm:p-3 text-xs sm:text-sm font-medium">
                            Rs.{tx.amount.toFixed(2)}
                          </td>
                          <td className="border border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                            {new Date(tx.date ?? Date.now()).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="block md:hidden space-y-3">
                {walletData.transactions.map((tx) => (
                  <div key={tx.transactionId} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">Transaction ID</div>
                        <div className="text-sm font-mono break-all">{tx.transactionId}</div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        tx.transactionType === "credit" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {tx.transactionType}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Amount</div>
                        <div className="text-sm font-semibold">Rs.{tx.amount.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Date</div>
                        <div className="text-sm">{new Date(tx.date ?? Date.now()).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

             
              <div className="flex justify-center items-center mt-4 sm:mt-6">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <button
                    className="px-2 sm:px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!paginationInfo.hasPreviousPage}
                  >
                    Previous
                  </button>
                  <span className="px-2 sm:px-4 py-2 text-black font-bold text-center text-xs sm:text-sm">
                    Page {paginationInfo.currentPage} of {paginationInfo.totalPages}
                  </span>
                  <button
                    className="px-2 sm:px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!paginationInfo.hasNextPage}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 text-sm sm:text-base py-8">No transactions found.</p>
          )}
        </div>
      </div>

    
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Withdraw Money</h2>
            <div onSubmit={handleWithdraw}>
              <input
                type="number"
                value={withdrawMoney.amount ?? ""}
                onChange={(e) => setWithdrawMoney({ amount: e.target.value })}
                placeholder="Enter amount"
                className="border border-gray-300 rounded-lg p-2 sm:p-3 w-full mb-4 sm:mb-6 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={handleWithdraw}
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wallet;