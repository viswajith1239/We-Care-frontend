

import axios from "axios";
import adminAxiosInstance from "../axios/adminAxiosInstance";
import API_URL from "../axios/API_URL";

const loginAdmin=async({email,password}:{email:string,password:string})=>{
    
    try{
  const  response= await adminAxiosInstance.post(`${API_URL}/admin/loginadmin`,{email,password})   
    console.log("response is",response)
    return response
    }catch(error:any){
        const errorMessage =
        error.response?.data?.message || "Admin login failed.";
      const statusCode = error.response?.status || 500;
  
      console.error("Admin Login Error:", errorMessage);
  
      throw {
        message: errorMessage,
        status: statusCode,
      };
    }

}

const getSpecializations = async () => {
  try {
    const response = await adminAxiosInstance.get(`${API_URL}/admin/specialization`); 
    return response;
  } catch (error) {
    console.error("Error fetching specializations:", error);
    throw error;
  }
}

const addSpecialization=async(formData: { name: string; description: string })=>{
  console.log("///  ")
  console.log("add specialization");
  
  
//  console.log("////////",Array.from(formData.entries()))
try {
  console.log('thi is try');
  
  const response= await axios.post(`${API_URL}/admin/specialization`,formData)
  console.log("got response from speciali",response)
  return response
} catch (error) {
  console.log("Error in addspecialization",error)
  
}
}


const updateSpecialization = async (id: string, formData: { name: string; description: string }) => {
  try{
    console.log("hei in ")
    const response= await adminAxiosInstance.put(`${API_URL}/admin/specialization/${id}`, formData);
    console.log(response)
       return response
  
  }catch(error){
    console.log("Error in frontend service",error)
  }
 
};
const deleteSpecialization= async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/admin/specializations/${id}`);
    return response;
  } catch (error) {
    console.error('Failed to delete specialization:', error);
    throw error;
  }
}



const adminService={
    loginAdmin,
    getSpecializations,
    addSpecialization,
    updateSpecialization,
    deleteSpecialization
    
}
export default adminService
