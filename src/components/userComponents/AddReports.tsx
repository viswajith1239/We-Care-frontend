import React, { useEffect, useState } from 'react';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import API_URL from '../../axios/API_URL';
import axiosInstance from "../../axios/userAxiosInstance";
import toast, { Toaster } from 'react-hot-toast';

interface ImageFile {
  file: File;
  url: string;
}
interface ReportData {
  _id: string;
  imageUrl: string;
  createdAt?: string;
}

const AddReports: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [previewImage, setPreviewImage] = useState<ImageFile | null>(null);
    const { userInfo } = useSelector((state: RootState) => state.user);
      const [reports, setReports] = useState<ReportData[]>([]); 
  const [isLoadingReports, setIsLoadingReports] = useState<boolean>(false);
    const { doctorInfo } = useSelector((state: RootState) => state.doctor);
    console.log("usere ",userInfo);
    

    console.log("pppssss",userInfo);

    const fetchReports = async () => {
    if (!userInfo || !userInfo.id) return;
    try {
      setIsLoadingReports(true);
      const response = await axiosInstance.get(`${API_URL}/user/reports/${userInfo.id}`);
      setReports(response.data.reports);
    } catch (error) {
      toast.error("Failed to load reports");
      console.error("Error fetching reports:", error);
    } finally {
      setIsLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [userInfo]);
    
  

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setSelectedImage({ file, url });
      
      setPreviewImage(null);
    }
  };

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedImage) return;

   
    if (!userInfo || !userInfo.id) {
      alert('Please log in to upload medical reports.');
      return;
    }

    setIsUploading(true);
    setPreviewImage(selectedImage);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage.file);
      formData.append('userId', userInfo.id); 
      formData.append('doctorId', doctorInfo.id); 

      
     
      if (userInfo.name) {
        formData.append('userName', userInfo.name);
      }
      if (userInfo.email) {
        formData.append('userEmail', userInfo.email);
      }

      const response = await axiosInstance.post(
        `${API_URL}/user/add-reports`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );


     const { cloudinaryUrl, documentId } = response.data;
      setUploadedUrl(cloudinaryUrl);

       toast.success('Medical report uploaded successfully!');


        handleClear();

  
      fetchReports();

      console.log('Image uploaded successfully:',cloudinaryUrl);
      console.log('MongoDB document ID:', documentId);
      console.log('User ID:', userInfo.id);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setPreviewImage(null);
    setUploadedUrl(null);
   
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
  
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <Toaster/> 
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Add your previous medical reports here
      </h1>
      
     
      <div className="mb-6 flex  flex-col justify-center items-center">
        <label 
          htmlFor="file-input" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select your reports
        </label>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className=" text-sm text-gray-500 
                     file:mr-4 file:py-2 file:px-4 
                     file:rounded-md file:border-0 
                     file:text-sm file:font-medium
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100
                     cursor-pointer"
        />
      </div>

    

   
      <div className="flex gap-3 mb-6 items-center justify-center">
        <button
          onClick={handleSubmit}
          disabled={!selectedImage || isUploading}
          className="px-4 py-2 bg-[#00897B] text-white rounded-md 
                     hover:bg-[#00897B] disabled:bg-gray-300 
                     disabled:cursor-not-allowed transition-colors
                     flex items-center gap-2"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Uploading...
            </>
          ) : (
            'Submit'
          )}
        </button>
        
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-500 text-white rounded-md 
                     hover:bg-gray-600 transition-colors"
        >
          Clear
        </button>
      </div>

     
      {isLoadingReports ? (
  <p className="text-center text-gray-500 mt-6">Loading your uploaded reports...</p>
) : reports.length > 0 ? (
  <div className="mt-8">
    <h2 className="text-lg font-semibold text-gray-800 mb-3">
      Your Uploaded Reports:
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {reports.map((report) => (
        <div key={report._id} className="bg-gray-100 p-3 rounded-lg shadow">
          <img
            src={report.imageUrl}
            alt="Medical Report"
            className="w-full h-48 object-cover rounded-md"
          />
          {report.createdAt && (
            <p className="text-xs text-gray-600 mt-2 text-center">
              Uploaded: {new Date(report.createdAt).toLocaleString()}
            </p>
          )}
        </div>
      ))}
    </div>
  </div>
) : (
  <p className="text-center text-gray-500 mt-6">No reports uploaded yet.</p>
)}
    </div>
  );
};

export default AddReports;