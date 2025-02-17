// import React from 'react'
import adminAxiosInstance from '../../axios/adminAxiosInstance'
import { useEffect,useState } from 'react'
import {User} from "../../types/user"

function UserListing(){
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage,setcurrentPage]=useState<number>(1)
    const [itemsPerPage]=useState<number>(5)

    useEffect(()=>{
        const fetchData=async()=>{
        try {
         const response=await adminAxiosInstance.get(`/admin/users`)
        setUsers(response.data.users)
            
        } catch (error) {
            console.log("Error in fextch datas",error)
        }
    }
        fetchData() 
    },[])


    const handleBlockUnblock=async(userId:string,currentStatus:boolean)=>{
        try {
           const response=await adminAxiosInstance.patch(`/admin/${userId}/block-unblock`,{status:!currentStatus})
           if(response.status===200 && response.data){
               const updatedUserStatus = response.data.data
               console.log("updated state is..........",updatedUserStatus)
               setUsers((prevUsers)=>
                   prevUsers.map((user)=>
                       user._id===userId?{...user,isBlocked:updatedUserStatus}:user
                   )
               )

           }else{
               console.error("fialed to update state")
           }
        } catch (error) {
           console.log("Error in block-unblock of user",error)
        }
   }

   const handlePageChange:any=(pageNumber:number)=>{
    if(pageNumber<1){
       setcurrentPage(1)
    }else if(pageNumber>Math.ceil(users.length/itemsPerPage)){
       setcurrentPage(Math.ceil(users.length/itemsPerPage))

    }else{
       setcurrentPage(pageNumber)
    }
   }

   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentSessions = users.slice(indexOfFirstItem, indexOfLastItem);

    return(
        <div className=" rounded-lg overflow-hidden mx-4 md:mx-10">
       <table className="border border-gray-200 divide-y divide-gray-200 rounded-lg overflow-hidden">
  <thead>
    <tr>
      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#00897B] bg-opacity-80">
        Serial No.
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#00897B] bg-opacity-80">
        Name
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#00897B] bg-opacity-80">
        Email
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#00897B] bg-opacity-80">
        Phone
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#00897B] bg-opacity-80">
        Status
      </th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
  {currentSessions.length > 0 ? (
    currentSessions.map((user, index) => (
      <tr key={user.id}>
        <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
        <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
        <td className="px-6 py-4 whitespace-nowrap">{user.phone}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div
            className={`${
              user.isBlocked ? "font-medium text-red-500 pr-2" : "font-medium text-[#86b979]"
            }`}
          >
            
          </div>
          <button
            onClick={() => handleBlockUnblock(user._id, user.isBlocked)}
            className={`text-white ppy-2 px-4 font-medium rounded-lg transition  ${
              user.isBlocked ? "bg-[#00897B]" : "bg-[#FF0000]"
            }`}
          >
            {user.isBlocked ? "Unblock" : "Block"}
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
        No users found.
      </td>
    </tr>
  )}
</tbody>

</table>
<div className="flex justify-center mt-4 relative left-[-100px]">

<button onClick={()=>handlePageChange(currentPage-1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-[#00897B] text-white rounded mr-2 bg-[#00897B]"

>previous</button>


<button onClick={()=>handlePageChange(currentPage+1)}
      disabled={indexOfLastItem >= users.length}
      className="px-4 py-2 bg-[#00897B] text-white rounded bg-[#00897B]"

>next
</button>

</div>

      </div>
    );
    
}
export default UserListing