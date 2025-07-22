
import { Link, useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import { AppDispatch, RootState } from "../../app/store"
import { loginUser, GoogleLogins } from "../../action/userActions"
import { GoogleLogin, CredentialResponse } from "@react-oauth/google"
import bgimage from "../../assets/doctor-nurses-special-equipment.jpg"


interface Errors {
  email?: string;
  password?: string;
}
function login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword,] = useState<boolean>(false);
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

  const clearErrors = () => {
    setTimeout(() => {
      setErrors({});
    }, 3000);
  };



  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formErrors = validate();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      clearErrors();
      return;
    }

    setErrors({});

    const userData = {
      email,
      password,
    };

    dispatch(loginUser(userData))
      .unwrap()
      .then(() => {
        toast.success("Login successful!");
        setTimeout(() => {
          navigate("/", { replace: true });
          window.history.pushState(null, "", window.location.href);
        }, 1000);
      })
      .catch((error: any) => {
        console.error("Login error:", error);


        const errorMessage = error?.message || "Login failed. Please check your credentials.";

        if (errorMessage === "Your account is blocked.") {
          toast.error("Your account is blocked.");
        } else if (errorMessage === "Invalid email or password") {
          toast.error(" Invalid email or password.");
        } else {
          toast.error(errorMessage);
        }
      });

  };

  // const { userInfo } = useSelector((state: RootState) => state.user);



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



  return (
    <div
      className="relative bg-cover bg-center min-h-screen"
      style={{ backgroundImage: `url(${bgimage})` }}
    >
      <Toaster />

      <div className='absolute -z-10 h-full overflow-hidden '>
        <div className='absolute bg-[#c8ebc51f] w-full h-full' ></div>

      </div>
      <section className="flex flex-col items-center py-10  justify-center" >
        <div
          className="w-[400px] md:w-[500px] bg-white/30 backdrop-blur-[1px] border border-white/40 rounded-lg shadow-lg p-6 md:mt-0 sm:max-w-md ">
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

                  className="block mb-2 text-md font-medium text-gray-900 dark:text-white text-left"
                >
                  Email
                </label>
                <input
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}

                  className="w-full h-[40px] p-2 text-black bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00897B] placeholder:text-black"


                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}


              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-md font-medium text-gray-900 dark:text-white text-left"
                >
                  Password
                </label>
                <input
                  value={password}
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"


                  className="w-full h-[40px] p-2 text-black bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00897B] placeholder:text-black"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}


              </div>

              <button
                type="submit"
                className="w-full text-white bg-[#00897B] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#00897B]"
              >
                Login
              </button>
              <p className="text-md font-light text-black text-center">
                Don't have an account?{' '}
                <Link
                  className="font-medium text-[#5cbba8] hover:underline hover:text-[#5cbba8]"
                  to="/signup"
                >
                  Sign in here
                </Link>
              </p>
              <p className="text-center mt-4">
                <a href="/forgot-password" className="text-[#00897B] hover:underline">
                  Forgot Password?
                </a>
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