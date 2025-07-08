import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { AppDispatch } from "../../app/store";
import { adminLogin } from "../../action/AdminActions";

interface Errors {
  email?: string;
  password?: string;
}

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const validate = (): Errors => {
    const newErrors: Errors = {};
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Please fill the email field";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Valid email is required";
    }
    
    if (!password.trim()) {
      newErrors.password = "Please fill the password field";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    return newErrors;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'email') {
      setEmail(value);
    } else if (field === 'password') {
      setPassword(value);
    }
    
    // Clear error when user starts typing
    if (errors[field as keyof Errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validate();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
        setTimeout(() => {
        setErrors({});
      }, 3000);
      return;
    }

    const adminData = {
      email,
      password,
    };

    try {
      const action = await dispatch(adminLogin(adminData));

      console.log("actionnnnnnnnnn", action);
      if (adminLogin.fulfilled.match(action)) {
        console.log("action keri");
        
        toast.success("Successfully logged in!");
        setTimeout(() => {
          navigate("/admin", { replace: true });
        }, 1000);
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full dark:bg-gray-950">
      <Toaster />
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-md w-[400px] min-h-[300px]">
        <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`shadow-sm rounded-md w-full px-3 py-2 border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <div className="mt-1 text-red-500 text-sm">{errors.email}</div>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`shadow-sm rounded-md w-full px-3 py-2 border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <div className="mt-1 text-red-500 text-sm">{errors.password}</div>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-[#00897B] flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-[#006f63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006f63] dark:bg-[#00897B]"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;