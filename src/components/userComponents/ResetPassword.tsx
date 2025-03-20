import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import userService from "../../service/userService";

function ResetPassword() {
    const [newPassword, setNewPassword] = useState<string>('');
    const [error, setError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [userData, setUserData] = useState<any>(null);

    const location = useLocation();
    const navigate = useNavigate();

    
    useEffect(() => {
        if (location.state) {
            setUserData(location.state);
            localStorage.setItem("resetUserData", JSON.stringify(location.state));
        } else {
            const storedData = localStorage.getItem("resetUserData");
            if (storedData) {
                setUserData(JSON.parse(storedData));
            }
        }
    }, [location.state]);

    const handlesubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        if (!userData) {
            setError("Invalid request. Please try again.");
            return;
        }
        try {
            const response = await userService.resetPassword(userData, { newPassword });
            if (response.message === "Password reset successfully") {
                toast.success("Your Password Reset Successfully");
                localStorage.removeItem("resetUserData");
                navigate("/login");
            }
        } catch (error) {
            setError("Failed to reset password. Please try again later.");
            console.error(error);
        }
    };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-8 py-10 bg-white rounded-lg shadow-md">
        <Toaster />
        <h1 className="text-2xl font-semibold text-center mb-6">Reset Password</h1>
        <form onSubmit={handlesubmit}>

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
           {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}
        
        <button  className="w-full bg-[#00897B] text-white p-2 rounded">
          Reset Password
        </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
