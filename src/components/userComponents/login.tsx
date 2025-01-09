
import {Link,useNavigate} from "react-router-dom"
import React, {  useState } from "react";
import { useDispatch } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import {AppDispatch} from "../../app/store"
import {loginUser,GoogleLogins} from "../../action/userActions"
import {GoogleLogin,CredentialResponse} from "@react-oauth/google"


function login(){
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
   const [showPassword, ] = useState<boolean>(false); 


  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // const { userInfo, error } = useSelector((state: RootState) => state.user);


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // const formErrors = validate();
    // setErrors(formErrors);
  
    // if (Object.keys(formErrors).length > 0) {
    //   clearErrors();
    //   return;
    // }
  
    // setErrors({});
  
    const userData = {
      email,
      password,
    };
  
    dispatch(loginUser(userData))
      .unwrap()
      .then(() => {
        toast.success("Login successful!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      })
      .catch((error: any) => {
        if (error?.message === "User is blocked") {
          toast.error("Your account is blocked.");
        } else if (error?.message === "Invalid email or password") {
          toast.error("Invalid email or password.");
        } else {
          toast.error("Login failed. Please check your credentials.");
        }
      });
  };
    
  const handleGoogleResponse = async (response: CredentialResponse) => {
    const token = response.credential;
    if (token) {
      dispatch(GoogleLogins(token)).then((response: any) => {
        if (response.meta.requestStatus !== "rejected") {
          navigate("/");
        }
      });
    }
  };

  const handleGoogleError = () => {
    console.error("Google login failed");
  };

     
      
    return(
<div className="relative bg-center  mt-0 min-h-screen">
           <Toaster />
        <div className='absolute -z-10 h-full overflow-hidden '>
          <div className='absolute bg-[#c8ebc51f] w-full h-full' ></div>
        
        </div>
        <section className="flex flex-col items-center py-10  justify-center" >
          <div
           className="w-[400px] md:w-[500px] bg-[#ffffff24] rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0  ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8 ">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Login
              </h1>
              <form  
              onSubmit={handleSubmit}
               className="space-y-4 md:space-y-3">
                
                <div>
                  <label
                    htmlFor="email"
                    
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                      type="text"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      
                    className="h-[37px] bg-transparent border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  
                  />
                   
               
                
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                   value={password}
                   type={showPassword ? "text" : "password"}
                      onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                
                    
                    className="h-[37px] bg-transparent border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  
             
                </div>
               
                <button
                  type="submit"
                  className="w-full text-white bg-[#00897B] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#00897B]"
                >
                  Login
                </button>
                <p className="text-sm font-light text-trbg-transparent0 dark:text-gray-700 text-center">
                Don't have an account?{' '}
                  <Link 
    className="font-medium text-[#5cbba8] hover:underline hover:text-[#5cbba8]"
    to="/signup"
  >
     Sign in here
  </Link>
                </p>
              </form>
              <div className="flex justify-center w-full mt-4">
              <GoogleLogin
                  onSuccess={handleGoogleResponse}
                  onError={handleGoogleError}
/>
                </div>
            </div>
          </div>
        </section>
      </div>
    )
}
export default login