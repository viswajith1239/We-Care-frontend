import React, { useState, useEffect } from "react";
import adminService from "../../service/adminService";
import { Toaster, toast } from "react-hot-toast";

interface Specialization {
  _id: string;
  name: string;
  description: string;
  isListed: boolean;
}

interface Errors {
  name?: string;
  description?: string;
}

export default function SpecializationTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [specialization, setSpecialization] = useState<Specialization[]>([]);
  const [editingSpecialization, setEditingSpecialization] = useState<Specialization | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
  }, []);

  const validate = (): { errors: Errors; isDuplicate: boolean } => {
    const newErrors: Errors = {};
    let isDuplicate = false;
    
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    

    if (!trimmedName) {
      newErrors.name = "Please fill the specialization name field";
    } else {
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameRegex.test(trimmedName)) {
        newErrors.name = "Specialization name should only contain letters and spaces";
      } else if (trimmedName.length < 3) {
        newErrors.name = "Specialization name must be at least 3 characters long";
      } else {
   
        const lowerCasedName = trimmedName.toLowerCase();
        const duplicateExists = specialization.some(
          (spec) =>
            spec.name.trim().toLowerCase() === lowerCasedName &&
            (!editingSpecialization || spec._id !== editingSpecialization._id)
        );
        if (duplicateExists) {
          isDuplicate = true;
        }
      }
    }
    
 
    if (!trimmedDescription) {
      newErrors.description = "Please fill the description field";
    } else if (trimmedDescription.length < 3) {
      newErrors.description = "Description must be at least 3 characters long";
    }
    
    return { errors: newErrors, isDuplicate };
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSpecialization(null);
    setName('');
    setDescription('');
    setErrors({});
  };

  const handleEditSpecialization = (spec: Specialization) => {
    setEditingSpecialization(spec);
    setName(spec.name);
    setDescription(spec.description);
    setErrors({});
    openModal();
  };

  const handleDeleteSpecialization = async (id: string) => {
    try {
      await adminService.deleteSpecialization(id);
      setSpecialization((prev) => prev.filter((spec) => spec._id !== id));
    } catch (error) {
      console.error("Failed to delete specialization:", error);
    }
  };


  const handleInputChange = (field: keyof Errors, value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(value);
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSaveSpecialization = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const validationResult = validate();
    setErrors(validationResult.errors);
    

    if (validationResult.isDuplicate) {
      toast.error("Specialization with this name already exists");
      return;
    }
    

    if (Object.keys(validationResult.errors).length > 0) {
      setTimeout(() => {
        setErrors({});
      }, 3000);
      return;
    }

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const formData = { name: trimmedName, description: trimmedDescription };

    try {
      if (editingSpecialization) {
        const response = await adminService.updateSpecialization(editingSpecialization._id, formData);
        const updatedSpecialization = response?.data.specialization;
        setSpecialization((prev) =>
          prev.map((spec) =>
            spec._id === editingSpecialization._id ? updatedSpecialization : spec
          )
        );
        toast.success("Specialization updated successfully!");
      } else {
        const response = await adminService.addSpecialization(formData);
        setSpecialization((prev) => [...prev, response?.data.specializationresponse]);
        toast.success("Specialization added successfully!");
      }
      closeModal();
    } catch (error) {
      console.error('Failed to save specialization:', error);
      toast.error("Failed to save specialization. Please try again.");
    }
  };

  const totalPages = Math.ceil(specialization.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSpecializations = specialization.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-4">
      <Toaster/>
      <button
        onClick={openModal}
        className="text-white bg-[#00897B] font-medium rounded-lg text-lg leading-8 px-8 py-3 cursor-pointer text-center mr-2 inline-flex items-center hover:bg-[#00766a]"
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
                <label className="block text-gray-700 font-medium mb-2">Specialization Name</label>
                <input
                  value={name || ""}
                  type="text"
                  onChange={(e) => handleInputChange('name', e.target.value, setName)}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#00897B] ${
                    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter specialization name"
                />
                {errors.name && (
                  <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Specialization Description</label>
                <textarea
                  value={description || ""}
                  onChange={(e) => handleInputChange('description', e.target.value, setDescription)}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#00897B] ${
                    errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter specialization description"
                  rows={3}
                />
                {errors.description && (
                  <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                )}
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
                  className="px-4 py-2 bg-[#00897B] text-white rounded hover:bg-[#00695c]"
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
          <div className="w-full max-w-4xl">
            <table className="w-full border border-gray-200 divide-y divide-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider bg-[#00897B] bg-opacity-80">Serial No.</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider bg-[#00897B] bg-opacity-80">Specialization Name</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider bg-[#00897B] bg-opacity-80">Description</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider bg-[#00897B] bg-opacity-80">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentSpecializations.map((specialization, index) => (
                  <tr key={specialization._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{startIndex + index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{specialization.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{specialization.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleEditSpecialization(specialization)}
                        className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSpecialization(specialization._id)}
                        className="ml-2 px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

           
            <div className="flex justify-between items-center space-x-2 mt-4">
              <button
                className={`px-6 py-2 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#00897B] text-white"
                }`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span className="px-6 py-2 text-black font-bold">{`Page ${currentPage} of ${totalPages}`}</span>
              <button
                className={`px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#00897B] text-white"
                }`}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}