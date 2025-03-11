import React, { useState,useEffect } from "react";
import adminService from "../../service/adminService";

interface Specialization {
    _id: string;
    name: string;
    description: string;
    isListed: boolean;
  }

export default function SpecializationTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [specialization, setSpecialization] = useState<Specialization[]>([]);
  const [editingSpecialization, setEditingSpecialization] = useState<Specialization | null>(null);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await adminService.getSpecializations();
        setSpecialization(response?.data || []);
      } catch (error) {
        console.error('Failed to fetch specializations:', error);
      }
    };

    fetchSpecializations();
  }, []); // Empty dependency array means this runs only once on mount

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSpecialization(null); // Reset editing state
    setName('');
    setDescription('');
  };

  // const handleAddSpecialization = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const formData = { name, description };

  //   try {
  //     const response = await adminService.addSpecialization(formData);
  //     const specializationData = response?.data.specializationresponse;

  //     // Update state with the new specialization
  //     setSpecialization((prev) => [...prev, specializationData]);

  //     closeModal(); // Close the modal after successful addition
  //   } catch (error) {
  //     console.error('Failed to add specialization:', error);
  //   }
  // };

  const handleEditSpecialization = (spec: Specialization) => {
    setEditingSpecialization(spec);
    setName(spec.name);
    setDescription(spec.description);
    openModal();  
  };

  const handleDeleteSpecialization = async (id: string) => {
    
      try {
        await adminService.deleteSpecialization(id); // Call the service method to delete
        setSpecialization((prev) => prev.filter((spec) => spec._id !== id)); // Update the state to remove the deleted specialization
      } catch (error) {
        console.error("Failed to delete specialization:", error);
      }
    
  };
  

  const handleSaveSpecialization = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = { name, description };

    try {
      if (editingSpecialization) {
        const response = await adminService.updateSpecialization(editingSpecialization._id, formData);
        const updatedSpecialization = response?.data.specialization;

        setSpecialization((prev) =>
          prev.map((spec) =>
            spec._id === editingSpecialization._id ? updatedSpecialization : spec
          )
        );
      } else {
        
        const response = await adminService.addSpecialization(formData);
        setSpecialization((prev) => [...prev, response?.data.specializationresponse]);
      }

      closeModal(); // Close the modal after saving
    } catch (error) {
      console.error('Failed to save specialization:', error);
    }
  };
  console.log("ss",specialization);
  

  return (
    <div className="p-4">
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-white bg-[#00897B]  font-medium rounded-lg text-lg leading-8 px-8 py-3 cursor-pointer text-center mr-2 inline-flex items-center hover:bg-[#00897B] "
      >
        Add Specialization
      </button>

      {isModalOpen && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-bold mb-4">
        {editingSpecialization ? "Edit Specialization" : "Add New Specialization"}
      </h2>
      <form onSubmit={handleSaveSpecialization}>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="specializationName"
          >
            Specialization Name
          </label>
          <input
            value={name || ""}
            type="text"
            id="specializationName"
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-400"
            placeholder="Enter specialization name"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="specializationDescription"
          >
            Specialization Description
          </label>
          <textarea
            value={description || ""}
            id="specializationDescription"
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-400"
            placeholder="Enter specialization description"
            rows={3}
            required
          ></textarea>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            
            className="px-4 py-2 bg-[#00897B]  text-white rounded hover:bg-bg-[#00897B] "
          >
            {editingSpecialization ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      <div className="w-full flex justify-center mt-6">
        {specialization.length === 0 ? (
          <p className="text-gray-500 text-xl font-medium">No specializations added.</p>
        ) : (
          <table className="border border-gray-200 divide-y divide-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#00897B] bg-opacity-80">
                  Serial No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white  uppercase tracking-wider bg-[#00897B] bg-opacity-80">
                  Specialization Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white  uppercase tracking-wider bg-[#00897B] bg-opacity-80">
                  Description
                </th>
                <th className="px-6 py-3 text-mid text-xs font-medium text-white  uppercase tracking-wider bg-[#00897B] bg-opacity-80">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {specialization.map((specialization, index) => (
                <tr key={specialization._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{specialization.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{specialization.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                    onClick={() => handleEditSpecialization(specialization)}
                     className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue active:bg-blue-600 transition duration-150 ease-in-out">
                      Edit
                    </button>
                    <button
                       onClick={() => handleDeleteSpecialization(specialization._id)}
                         className="ml-2 px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:shadow-outline-red active:bg-red-600 transition duration-150 ease-in-out"
                         >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
