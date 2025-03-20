import { useEffect, useState } from "react";
import { DoctorListFilterBarProps } from "../../types/doctor";
import axios from "../../axios/userAxiosInstance";
import API_URL from "../../axios/API_URL";
import { Specialization } from "../../types/doctor";
import { useNavigate } from "react-router-dom";



function DoctorsListFilterBar({ }:DoctorListFilterBarProps) {
    const [] = useState({
      specialization: [],
      // gender: "",
      // priceRange: [0, 100],
      // language: "",
    });
  
    const[specializations,setSpecializations]=useState<Specialization[]>([])
    const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
    const [displayLimit, setDisplayLimit] = useState(4);
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate=useNavigate()
  
  useEffect(()=>{
  
   const getspecializations=async()=>{
      try {
        const response=await axios.get(`${API_URL}/user/specializations`)
        
        setSpecializations(response.data)
      } catch (error) {
        console.log("error in fetching specialisation:",error)
      }
    }
    getspecializations()
  },[])
  
  
  
    const handleFilterChange = (type: string, value: string ) => {
   
   let updatedSelectedvalue:string[] = [];
   if(type==="specialization"){
   updatedSelectedvalue=selectedSpecializations.includes(value)?selectedSpecializations.filter((id)=>id!==value):[...selectedSpecializations,value]
    console.log("updated val=",updatedSelectedvalue)
    setSelectedSpecializations(updatedSelectedvalue)
  
   }
   const params=new URLSearchParams(window.location.search)
    if(type&& updatedSelectedvalue.length>0){
      params.set(type,updatedSelectedvalue.join(","))
  
    }else{
      params.delete(type)
    }
    console.log("Updated Params:", params.toString());
  
    navigate(`/doctors?${params.toString()}`)
    
    };
  
  
    
   
  
    
    const handleToggleDisplay = () => {
    
      if (isExpanded) {
        setDisplayLimit(4);
      } else {
        setDisplayLimit(specializations.length);
      }
      setIsExpanded(!isExpanded);
    };
  
  
    return (
        <div className="bg-[#00897B] shadow-lg rounded-xl p-6 space-y-6 mt-10 border border-gray-300 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white">Filter Doctors</h2>
      
       
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-white mb-4">
            Specialization
          </label>
      
          <div className="grid grid-cols-2 gap-3">
            {specializations.slice(0, displayLimit).map((spec) => (
              <div
                key={spec._id}
                className="flex items-center space-x-3 bg-gray-100 p-2 rounded-lg w-full max-w-full"
              >
                <input
                  type="checkbox"
                  value={spec._id}
                  checked={selectedSpecializations.includes(spec._id)}
                  onChange={() => handleFilterChange("specialization", spec._id)}
                  className="w-5 h-5 rounded-md border-gray-400 text-indigo-600 focus:ring focus:ring-indigo-300"
                />
                <label className="text-sm font-medium text-gray-900 flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                  {spec.name}
                </label>
              </div>
            ))}
          </div>
      
          {specializations.length > 4 && (
            <button
              className="text-sm font-semibold text-white mt-3 hover:underline"
              onClick={handleToggleDisplay}
            >
              {isExpanded ? "SEE LESS" : "SEE MORE"}
            </button>
          )}
        </div>
      </div>
      
      
    );
  }
  
  export default DoctorsListFilterBar;