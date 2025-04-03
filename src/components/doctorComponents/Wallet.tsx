
import React, { useState,useEffect } from 'react';
import { IWallet } from "../../types/doctor";

import toast, { Toaster } from "react-hot-toast";
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import API_URL from '../../axios/API_URL';
import doctorAxiosInstance from '../../axios/doctorAxiosInstance';

function Wallet(){
    const [walletData, setWalletData] = useState<IWallet | null>(null);
    const { doctorInfo } = useSelector((state: RootState) => state.doctor);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [withdrawMoney, setWithdrawMoney] = useState<{ amount: string | null }>({ amount: null });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    



    useEffect(() => {
        const fetchWalletData = async () => {
          const response = await doctorAxiosInstance.get(`${API_URL}/doctor/wallet-data/${doctorInfo.id}`);
          console.log("vbvbvb",response);
          
          setWalletData(response.data);
        };
        fetchWalletData();
      }, [doctorInfo.id]);
      const handleWithdrawButton = () => {
        setIsModalOpen(true);
      };const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
      
        const amount = withdrawMoney.amount ?? "";
        if (!amount || parseFloat(amount) <= 0) {
          toast("Please enter a valid amount to withdraw.");
          return;
        }
      
        try {
          const response = await doctorAxiosInstance.post(`${API_URL}/doctor/withdraw/${doctorInfo.id}`, {
            amount: parseFloat(amount),
          });
      
          if (response.status === 200) {
            toast.success("Money withdrawal successful.");
      
            setWalletData((prev) => {
              if (!prev) return null;
      
              const newTransaction = {
                transactionId: `txn_${Date.now()}`,
                amount: parseFloat(amount),
                transactionType: "debit",
                date: new Date(),
              };
      
              return {
                ...prev,
                balance: prev.balance - parseFloat(amount),
                transactions: [...prev.transactions, newTransaction],
              };
            });
      
            setIsModalOpen(false);
            setWithdrawMoney({ amount: null });
          } else {
            alert("Withdrawal request failed. Please try again.");
          }
        } catch (error) {
          alert("An error occurred. Please try again later.");
        }
      };
      

    //   const toggleModal = () => {
    //     setWithdrawMoney({amount: null})
    //     setIsModalOpen(!isModalOpen);
    //   };
    //   const handleChangePage = (event: unknown, newPage: number) => {
    //     setPage(newPage);
    //   };
      
    //   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setRowsPerPage(parseInt(event.target.value, 10));
    //     setPage(0);
    //   };
    //   const paginatedTransactions = walletData?.transactions.slice(
    //     page * rowsPerPage,
    //     page * rowsPerPage + rowsPerPage
    //   );
            

    return (
        <div className="max-w-lg mx-auto p-4">
            <div className="bg-white p-6 shadow rounded mb-4">
                <h2 className="text-center text-xl font-semibold">Wallet Balance</h2>
                <h3 className="text-center text-3xl text-green-600">Rs.{walletData?.balance}</h3>
                <button className="bg-red-500 text-white px-4 py-2 rounded mt-4 block mx-auto" onClick={handleWithdrawButton}>
                    Withdraw Money
                </button>
            </div>

            <h2 className="text-center text-lg font-semibold mb-2">Transaction History</h2>
            <div className="bg-white p-4 shadow rounded">
                {walletData?.transactions.length ? (
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
                                    <td className={`border p-2 ${tx.transactionType === 'credit' ? 'text-green-600' : 'text-red-600'}`}>{tx.transactionType}</td>
                                    <td className="border p-2">Rs.{tx.amount.toFixed(2)}</td>
                                    <td className="border p-2">{new Date(tx.date ?? Date.now()).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                                value={withdrawMoney.amount ?? ''}
                                onChange={(e) => setWithdrawMoney({ amount: e.target.value })}
                                placeholder="Enter amount"
                                className="border rounded-lg p-2 w-full mb-4"
                                required
                            />
                            <div className="flex justify-end space-x-4">
                                <button type="button" className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
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


export default Wallet