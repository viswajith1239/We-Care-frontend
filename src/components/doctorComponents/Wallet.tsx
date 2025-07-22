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
        <p>Loading wallet data...</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-gray-50 min-h-screen ">
      <Toaster />
      <div className="bg-white p-6 shadow rounded mb-4">
        <h2 className="text-center text-xl font-semibold">Wallet Balance</h2>
        <h3 className="text-center text-3xl text-green-600">Rs.{walletData?.balance}</h3>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded mt-4 block mx-auto"
          onClick={handleWithdrawButton}
        >
          Withdraw Money
        </button>
      </div>

      <h2 className="text-center text-lg font-semibold mb-2">Transaction History</h2>
      <div className="bg-white  p-4 shadow rounded">
        {walletData?.transactions?.length ? (
          <>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Transaction ID</th>
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Amount</th>
                  <th className="border p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {walletData.transactions.map((tx) => (
                  <tr key={tx.transactionId}>
                    <td className="border p-2">{tx.transactionId}</td>
                    <td className={`border p-2 ${tx.transactionType === "credit" ? "text-green-600" : "text-red-600"}`}>
                      {tx.transactionType}
                    </td>
                    <td className="border p-2">Rs.{tx.amount.toFixed(2)}</td>
                    <td className="border p-2">{new Date(tx.date ?? Date.now()).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>


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
                <div className='flex'>
                  <button
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!paginationInfo.hasNextPage}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">No transactions found.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Withdraw Money</h2>
            <form onSubmit={handleWithdraw}>
              <input
                type="number"
                value={withdrawMoney.amount ?? ""}
                onChange={(e) => setWithdrawMoney({ amount: e.target.value })}
                placeholder="Enter amount"
                className="border rounded-lg p-2 w-full mb-4"
                required
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Withdraw
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wallet;