import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import { loginDoctor } from "../../action/doctorActions"
// import {GoogleLogin,CredentialResponse} from "@react-oauth/google"
import bgimage from "../../assets/young-handsome-physician-medical-robe-with-stethoscope.jpg"

interface Errors {
  email?: string;
  password?: string;
}

function DoctorLogin() {
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


    if (errors[field as keyof Errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
     
      setTimeout(() => {
        setErrors({});
      }, 3000);
      return;
    }

    try {
      const loginData = { email, password };
      console.log("Login data....:", loginData);
      const action = await dispatch(loginDoctor(loginData));
      console.log(action, "loginaction")

      if (loginDoctor.rejected.match(action)) {
        const message = "Invalid credentials";
        toast.error(message);
        return;
      }

      navigate("/doctor");
    } catch (error: any) {
      if (error.response) {
        console.error("Error in login user data", error);
        toast.error("Something went wrong, try again later");
         const errorMessage = error?.message || "Login failed. Please check your credentials.";
        
                if (errorMessage === "Your account is blocked.") {
                  toast.error("Your account is blocked.");
                } else if (errorMessage === "Invalid email or password") {
                  toast.error(" Invalid email or password.");
                } else {
                  toast.error(errorMessage);
                }
      }
    }
  };

  //  const handleGoogleResponse = async (response: CredentialResponse) => {
  //     const token = response.credential;
  //     if (token) {
  //       dispatch(GoogleLogins(token)).then((response: any) => {
  //         console.log("dd",response)
  //         if (response.meta.requestStatus !== "rejected") {
  //           const doctor = response.payload; // Assuming backend sends doctor data
  //           console.log("uuu",doctor);


  //           if (doctor?.pending) {
  //             navigate("/doctor");  // Redirect to Doctor Dashboard
  //           } else {
  //             toast.error("Complete your KYC verification first.");
  //             navigate("/doctor");  // Redirect to KYC page
  //           }
  //         }
  //       });
  //     }
  //   };

  // const handleGoogleError = () => {
  //   console.error("Google login failed");
  // };

  return (
    <div
      className="relative bg-cover bg-center min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${bgimage})` }}
    >
      <Toaster />
      
      <section className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-md">
        <div className="w-full rounded-2xl sm:rounded-3xl bg-white/30 backdrop-blur-[1px] shadow border border-white/20 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-4 sm:p-6 md:p-8 space-y-4 md:space-y-6">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white text-center">
              Doctor Login
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>

              <div>
                <label 
                  htmlFor="username" 
                  className="block mb-2 text-sm sm:text-md font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  type="email"
                  name="username"
                  id="username"
                  className={`bg-gray-50 border text-gray-900 text-sm sm:text-base rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 sm:p-3 placeholder-black dark:bg-gray-700 dark:border-gray-600 dark:placeholder-black dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email"
                />
                {errors.email && (
                  <div className="mt-1 text-red-500 text-xs sm:text-sm">{errors.email}</div>
                )}
              </div>

              <div>
                <label 
                  htmlFor="password" 
                  className="block mb-2 text-sm sm:text-md font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter password"
                  className={`bg-gray-50 border text-gray-900 text-sm sm:text-base rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 sm:p-3 placeholder-black dark:bg-gray-700 dark:border-gray-600 dark:placeholder-black dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-200 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.password && (
                  <div className="mt-1 text-red-500 text-xs sm:text-sm">{errors.password}</div>
                )}
              </div>

              <button
                type="submit"
                className="w-full text-white bg-[#00897B] hover:bg-[#00776B] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:text-base px-5 py-2.5 sm:py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors duration-200"
              >
                Login
              </button>

              <p className="text-sm sm:text-md font-light text-black-500 dark:text-black-400 text-center">
                Don't have an account?{' '}
                <Link
                  className="font-medium text-[#5cbba8] hover:underline hover:text-[#5cbba8] transition-colors duration-200"
                  to="/doctor/signup"
                >
                  Sign in here
                </Link>
              </p>

              <p className="text-center mt-4">
                <a 
                  href="/doctor/doctor-forgot-password" 
                  className="text-[#00897B] hover:underline text-sm sm:text-base transition-colors duration-200"
                >
                  Forgot Password?
                </a>
              </p>
            </form>
            
            {/* <div className="flex justify-center w-full mt-4">
              <div className="scale-90 sm:scale-100">
                <GoogleLogin
                    onSuccess={handleGoogleResponse}
                    onError={handleGoogleError}
                />
              </div>
            </div> */}
          </div>
        </div>
      </section>
    </div>
  )
}
export default DoctorLogin