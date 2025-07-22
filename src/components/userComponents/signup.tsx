import React, { useState } from "react";
import { AppDispatch } from "../../app/store";

import { Toaster, toast } from "react-hot-toast";
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { registerForm } from "../../action/userActions"
import bgimage from "../../assets/doctor-nurses-special-equipment.jpg"
import { User } from "../../features/userTyepes"
// import image from "../../assets/health-still-life-with-copy-space.jpg"
// import { FiEye, FiEyeOff } from "react-icons/fi"; 

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}
const Signup: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword,] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});


  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()

  const validate = (): Errors => {
    const newErrors: Errors = {};
    if (!name.trim()) {
      newErrors.name = "Please fill the name field";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Please fill the email field";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Valid email is required";
    }
    if (!phone.trim()) {
      newErrors.phone = "Please fill the phone field";
    } else if (!phone.match(/^\d{10}$/)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (!password.trim()) {
      newErrors.password = "Please fill the password field";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors = validate();
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) {
      setTimeout(() => {
        setErrors({});
      }, 3000);
      return;

    }
    const userData: User = {
      name, email, phone, password,
      profileImage: ""
    };
    const action = await dispatch(registerForm(userData));
    if (registerForm.rejected.match(action)) {
      toast.error(action.payload?.message || "Something went wrong");
      return;
    }
    toast.success("OTP sent to your email");
    navigate("/verifyotp", { state: userData, replace: true });
  };



  return (


    <div
      className="relative bg-cover bg-center min-h-screen"
      style={{ backgroundImage: `url(${bgimage})` }}
    >
      <Toaster />
      <div className='absolute -z-10 h-full overflow-hidden '>
        <div className='absolute bg-[#c8ebc51f] w-full h-full' ></div>
        {/* <img src={image} alt="" className='w-screen object-contain' /> */}
      </div>
      <section className="flex flex-col items-center py-10  justify-center" >

        <div
          className="w-[400px] md:w-[500px] bg-white/30 backdrop-blur-[1px] rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0  ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 ">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 md:space-y-3">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-md font-medium text-gray-900 dark:text-white text-left"
                >
                  Your full name
                </label>
                <input
                  type="text"
                  name="Name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"

                  className="h-[37px] bg-white/50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 placeholder-black dark:border-gray-600 dark:placeholder-black dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"


                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-md font-medium text-gray-900 dark:text-white text-left"
                >
                  Email
                </label>
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-[37px] bg-white/50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 placeholder-black dark:border-gray-600 dark:placeholder-black dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"


                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-md font-medium text-gray-900 dark:text-white text-left"
                >
                  Phone
                </label>
                <input
                  type="number"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}

                  className="h-[37px] bg-white/50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 placeholder-black dark:border-gray-600 dark:placeholder-black dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"

                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-md font-medium text-gray-900 dark:text-white text-left"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-[37px] bg-white/50border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 placeholder-black dark:border-gray-600 dark:placeholder-black dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"

                />

                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                className="w-full text-white bg-[#00897B] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#00897B]"
              >
                Create an account
              </button>
              <p className="text-sm font-light text-trbg-transparent0 dark:text-gray-700 text-center">
                Already have an account?{' '}
                <Link
                  className="font-medium text-[#5cbba8] hover:underline hover:text-[#5cbba8]"
                  to="/login"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>

    </div>


  )

}

export default Signup