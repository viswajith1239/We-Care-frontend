import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { AppDispatch } from "../../app/store";
import { adminLogin } from "../../action/AdminActions";

function Login() {

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          navigate("/admin",{replace:true});
        }, 1000);
      }else{
        toast.error("Invalid Credentials")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      // setError("An error occurred. Please try again.");
    }
  };
    return (
      <div className=" min-h-screen flex items-center justify-center w-full dark:bg-gray-950">
        <Toaster/>
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-md w-[400px] min-h-[300px]" >
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
                onChange={(e) => setEmail(e.target.value)}
               
                className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
                required
              />
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
                 onChange={(e) => setPassword(e.target.value)}
                className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
                required
              />
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
  