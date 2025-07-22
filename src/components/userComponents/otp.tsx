import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import { verifyOtp } from "../../action/userActions";
import axios from "axios";
import API_URL from "../../axios/API_URL";
import { Toaster, toast } from "react-hot-toast"

interface Errors {
  otp?: string;
}

const Otp: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(4).fill(""));
  const [errors, setErrors] = useState<Errors>({});
  const [seconds, setSeconds] = useState<number>(60);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [otpVerified, setOtpVerified] = useState(false);

  const location = useLocation();
  const userData = location.state;

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const startCountdown = () => {
    setSeconds(60);
    setIsDisabled(true);
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startCountdown();
  }, []);

  const validate = () => {
    const newError: Errors = {};
    if (otp.some((digit) => digit.trim() === "")) {
      newError.otp = "Please enter all 4 digits of the OTP";
    }
    return newError;
  };

  const clearErrors = () => {
    setTimeout(() => {
      setErrors({});
    }, 3000);
  };

  const handleChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);


      if (value && index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();

    const otpErrors = validate();
    setErrors(otpErrors);

    if (Object.keys(otpErrors).length > 0) {
      clearErrors();
      return;
    }

    const otpString = otp.join("");
    if (userData) {
      dispatch(verifyOtp({ userData, otp: otpString })).then((res) => {

        if (res.meta.requestStatus === "fulfilled") {
          toast.success("OTP verified successfully!");
          setOtpVerified(true);
        } else {
          toast.error(res.payload?.message || "Invalid OTP. Please try again.");
        }
      });
    }
  };

  const resendOtp = async () => {
    try {
      console.log("Email sent for resend OTP:", userData?.email);
      const response = await axios.post(`${API_URL}/user/resend-otp`, {
        email: userData?.email,
      });

      if (response.status === 200) {
        toast.success("OTP resent successfully!");
        startCountdown();
      } else {
        toast.error(response.data?.message || "An error occurred. Please try again.");
      }
    } catch (error: any) {
      console.error("Error resending OTP:", error);
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };


  useEffect(() => {
    if (otpVerified) {
      navigate("/login", { replace: true });
    }
  }, [otpVerified, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-8 py-10 bg-white rounded-lg shadow-md dark:bg-gray-950 dark:text-gray-200">
        <Toaster />
        <h1 className="text-2xl font-semibold text-center mb-6">Enter OTP</h1>

        <div className="grid grid-cols-4 gap-x-4 my-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="rounded-lg bg-gray-100 dark:bg-gray-800 w-14 aspect-square text-center text-gray-700 dark:text-gray-400"
            />
          ))}
        </div>
        {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}

        <div className="flex items-center flex-col justify-between mb-6">
          <p className="text-gray-600 text-sm">Didn't receive code?</p>
          <div className="flex items-center space-x-2">


          </div>
        </div>

        <button
          onClick={handleClick}
          type="submit"
          className="w-full text-white bg-[#00897B] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#00897B]"
        >
          Verify
        </button>
        <button
          onClick={resendOtp}
          disabled={isDisabled}
          className={`w-full mt-4 py-2 px-4 ${isDisabled ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white rounded-md transition duration-200`}
        >
          {isDisabled ? `Resend OTP in ${seconds}s` : "Resend OTP"}
        </button>
      </div>
    </div>
  );
};

export default Otp;