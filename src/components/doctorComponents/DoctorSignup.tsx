import React,{useState,useEffect} from "react";
import axios from "axios";
import {Link} from "react-router-dom"
import API_URL from "../../axios/API_URL";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {registerDoctor} from "../../action/doctorActions"
import { Toaster,  toast } from "react-hot-toast";
import bgimage from "../../assets/young-handsome-physician-medical-robe-with-stethoscope.jpg"

interface ISpecialization {
    _id: string;
    name: string;
  }
  interface Errors {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
  }
function DoctorSignUp(){

    const [name,SetName]=useState<string>("")
    const [email,SetEmail]=useState<string>("")
    const [phone,SetPhone]=useState<string>("")
    const [password,SetPassword]=useState<string>("")
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [specializations, setSpecializations] = useState<ISpecialization[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
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

  useEffect(() => {
    const fetchSpecializations = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/doctor/specializations`);
        setSpecializations(response.data.data);
      } catch (error) {
        console.error("Error fetching specializations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecializations();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSpecializationChange = (name: string) => {
    setSelectedSpecializations((prev) =>
      prev.includes(name)
        ? prev.filter((spec) => spec !== name)
        : [...prev, name]
    );
    setIsDropdownOpen(false)
  }

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
    const doctorData = {
      name,
      email,
      phone,
      password,
      specializations: selectedSpecializations,
    };
    await dispatch(registerDoctor(doctorData));
    toast.success("OTP sent to your email");
    navigate("/doctor/otp", { state: doctorData ,replace:true});
  };

 
    return(
      <div 
      className="relative bg-cover bg-center min-h-screen" 
      style={{ backgroundImage: `url(${bgimage})` }}
    >
        <section className="flex flex-col items-center pt-6  max-w-1xl w-full ">
          <Toaster/>
        <div className="w-full  rounded-3xl bg-white/30 backdrop-blur-[1px]   shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
             Doctor Signup
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                   Full name
                </label>
                <input
                   value={name}
                   onChange={(e) => SetName(e.target.value)}
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 placeholder-black dark:bg-gray-700 dark:border-gray-600 dark:placeholder-black dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"

                  placeholder="Enter name"
                
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => SetEmail(e.target.value)}
                  type="email"
                  name="username"
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 placeholder-black dark:bg-gray-700 dark:border-gray-600 dark:placeholder-black dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"

                  placeholder="Enter email"
                  required
                />
                 {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Phone Number
                </label>
                <input
                value={phone}
                onChange={(e) => SetPhone(e.target.value)}
                  type="number"
                  name="phone"
                  id="phone"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 placeholder-black dark:bg-gray-700 dark:border-gray-600 dark:placeholder-black dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"

                  placeholder="Enter phone"
                  required
                />
                 {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div className="relative">
  <div
    className="relative border border-gray-300 p-2 rounded-md w-full text-left focus:ring-2 focus:ring-[#572c5f] cursor-pointer  bg-white"
    onClick={toggleDropdown}
  >
    {/* Text Content */}
    <span>
      {selectedSpecializations.length > 0
        ? selectedSpecializations.join(", ")
        : "Select Specializations"}
    </span>

    {/* Dropdown Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute top-1/2 right-2 h-5 w-5 transform -translate-y-1/2 transition-transform duration-200 ${
        isDropdownOpen ? "rotate-180" : ""
      }`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  </div>

  {/* Dropdown Options */}
  {isDropdownOpen && (
    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
      {loading ? (
        <div className="p-2 text-gray-500">Loading...</div>
      ) : (
        specializations.map((spec) => (
          <div
            key={spec._id}
            className="p-2 hover:bg-gray-200 cursor-pointer flex items-center"
            onClick={() => handleSpecializationChange(spec.name)}
          >
            <input
              type="checkbox"
              checked={selectedSpecializations.includes(spec.name)}
              readOnly
              className="mr-2"
            />
            {spec.name}
          </div>
        ))
      )}
    </div>
  )}
</div>

              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                value={password}
                onChange={(e) => SetPassword(e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 placeholder-black dark:bg-gray-700 dark:border-gray-600 dark:placeholder-black dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
              <button
                type="submit"
                className="w-full text-white bg-[#00897B] bg-[#00897B] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Create an account
              </button>
              <p className="text-md font-light text-black-500 dark:text-black-400">
                Already have an account? 
                <Link 
    className="font-medium text-[#5cbba8] hover:underline hover:text-[#5cbba8]"
    to="/doctor/login"
  >
     Login in here
  </Link>
            
              </p>
            </form>
          </div>
        </div>
      </section>

      </div>
      
    )
}
export default DoctorSignUp