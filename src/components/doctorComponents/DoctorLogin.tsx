import {Link,useNavigate} from "react-router-dom"
import {useState} from "react";
import { Toaster, toast } from "react-hot-toast";
import { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import {loginDoctor} from "../../action/doctorActions"
// import {GoogleLogin,CredentialResponse} from "@react-oauth/google"
import bgimage from "../../assets/young-handsome-physician-medical-robe-with-stethoscope.jpg"

interface Errors {
  email?: string;
  password?: string;
}

function DoctorLogin(){
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const validationErrors = validate();
        setErrors(validationErrors);
        
        if (Object.keys(validationErrors).length > 0) {
          // Clear errors after 3 seconds
          setTimeout(() => {
            setErrors({});
          }, 3000);
          return;
        }
    
        try {
          const loginData = { email, password };
          console.log("Login data....:", loginData);
          const action = await dispatch(loginDoctor(loginData));
          console.log(action,"loginaction")
          
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
      
        return(
          <div 
          className="relative bg-cover bg-center min-h-screen" 
          style={{ backgroundImage: `url(${bgimage})` }}
        >
                <section className="flex flex-col items-center pt-6  max-w-1xl w-full ">
                     <Toaster />
                <div className="w-full  rounded-3xl bg-white/30 backdrop-blur-[1px] shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                  <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                     Doctor Login
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                      
                      <div>
                        <label htmlFor="username" className="block mb-2 text-md font-medium text-gray-900 dark:text-white ">
                          Email
                        </label>
                        <input
                          value={email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          type="email"
                          name="username"
                          id="username"
                          className={`bg-gray-50 border text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 placeholder-black dark:bg-gray-700 dark:border-gray-600 dark:placeholder-black dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter email"
                        />
                        {errors.email && (
                          <div className="mt-1 text-red-500 text-sm">{errors.email}</div>
                        )}
                      </div>
                     
                     
        
                      <div>
                        <label htmlFor="password" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">
                          Password
                        </label>
                        <input
                        value={password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                          type="password"
                          name="password"
                          id="password"
                          placeholder="Enter password"
                          className={`bg-gray-50 border text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 placeholder-black dark:bg-gray-700 dark:border-gray-600 dark:placeholder-black dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                            errors.password ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.password && (
                          <div className="mt-1 text-red-500 text-sm">{errors.password}</div>
                        )}
                      </div>
                      <button
                        type="submit"
                        className="w-full text-white bg-[#00897B] bg-[#00897B] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Login
                      </button>
                      <p className="text-md font-light text-black-500 dark:text-black-400">
                      Don't have an account?{' '} 
                      <Link 
    className="font-medium text-[#5cbba8] hover:underline hover:text-[#5cbba8]"
    to="/doctor/signup"
  >
     Sign in here
  </Link>
                      </p>
                      <p className="text-center mt-4">
            <a href="/doctor/doctor-forgot-password" className="text-[#00897B] hover:underline">
              Forgot Password?
            </a>
          </p>
                    </form>
                    {/* <div className="flex justify-center w-full mt-4">
              <GoogleLogin
                  onSuccess={handleGoogleResponse}
                  onError={handleGoogleError}
/>
                </div> */}
                  </div>
                </div>
              </section>
              </div>
        )
}
export default DoctorLogin