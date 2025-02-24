import React,{ useState } from 'react';
import userService from '../../service/userService';
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function ForgotPassword() {
    const[email,setEmail]=useState("")
    const navigate=useNavigate()

    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        try {
            const emailData:string=email
            let action=await userService.forgotPassword(emailData)
            
            if(action.statusCode===200){
            toast.success("Email verified successfully")
            navigate("/forgot-passwordOtp",{ state: emailData })
            }
           
        } catch (error) {
            console.log("error",error)
            toast.error("Invalid Email Address!!")
        }
    }
    
  return (
     <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <main id="content" role="main" className="w-full max-w-md mx-auto p-6">
      <div className="mt-7 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-0 overflow-hidden">

          <div className="p-4 sm:p-7">
            

            <div className="mt-5">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold ml-1 mb-2 dark:text-white">
                     Enter your Email address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        name="email"
                        className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                        required
                        aria-describedby="email-error"
                      />
                    </div>
                    <p className="hidden text-xs text-red-600 mt-2" id="email-error">
                      Please include a valid email address so we can get back to you
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-[#00897B] text-white bg-[#00897B] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                  >
                    Reset password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

       
      </main>
    </div>
  );
}

export default ForgotPassword;
