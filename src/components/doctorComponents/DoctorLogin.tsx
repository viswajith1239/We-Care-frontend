import {Link,useNavigate} from "react-router-dom"
import {useState} from "react";
import { Toaster, toast } from "react-hot-toast";
import { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import {loginDoctor} from "../../action/doctorActions"





function DoctorLogin(){
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        
    
        try {
          const loginData = { email, password };
          console.log("Login data....:", loginData);
          const action = await dispatch(loginDoctor(loginData));
          console.log(action,"loginaction");
          
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
        return(
            
                <section className="flex flex-col items-center pt-6  max-w-1xl w-full ">
                     <Toaster />
                <div className="w-full  rounded-3xl bg-white  shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                  <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                     Doctor Login
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                      
                      <div>
                        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Email
                        </label>
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          name="username"
                          id="username"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Enter email"
                          required
                        />
                      </div>
                     
                     
        
                      <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Password
                        </label>
                        <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          name="password"
                          id="password"
                          placeholder="••••••••"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full text-white bg-[#00897B] bg-[#00897B] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Login
                      </button>
                      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Don't have an account?{' '} 
                      <Link 
    className="font-medium text-[#5cbba8] hover:underline hover:text-[#5cbba8]"
    to="/doctor/signup"
  >
     Sign in here
  </Link>
                      </p>
                    </form>
                  </div>
                </div>
              </section>
        )
}
export default DoctorLogin