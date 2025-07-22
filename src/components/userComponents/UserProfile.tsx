import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { User } from "../../features/userTyepes";
import userAxiosInstance from "../../axios/userAxiosInstance";
import toast, { Toaster } from "react-hot-toast";
import API_URL from "../../axios/API_URL";
import { getuser } from "../../service/userService";

function UserProfile() {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [currentPassword, setCurrentPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [formData, setFormData] = useState<User>({ id: "", name: "", phone: "", email: "", password: "", dob: "", gender: "", profileImage: "" });
  const [passwordVisibility, setPasswordVisibility] = useState({ current: false, new: false, confirm: false, });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const userId = userInfo?.id;
  console.log("iii", userId);


  useEffect(() => {
    if (!userId) return;

    const fetchUserDetails = async (userId: string) => {
      console.log("ppp");

      try {
        console.log("hhhhh");

        const response = await getuser(userId);
        console.log("yyy", response);

        setFormData(response.data.response);
        if (response.data.response.profileImage) {
          setPreviewUrl(response.data.response.profileImage);
        }
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };
    fetchUserDetails(userId);
  }, [userId]);

  const handleEdit = () => {
    setEditOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, JPG, PNG, or GIF)');
        return;
      }


      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);


      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'wecare');
    formData.append('cloud_name', 'dxop0bbkp');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dxop0bbkp/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploadingImage(true);

    try {
      let updatedFormData = { ...formData };


      if (selectedFile) {
        try {
          const imageUrl = await uploadImageToCloudinary(selectedFile);
          updatedFormData.profileImage = imageUrl;
        } catch (error) {
          toast.error('Failed to upload profile image');
          setIsUploadingImage(false);
          return;
        }
      }

      const response = await userAxiosInstance.patch(`${API_URL}/user/update-user`, updatedFormData);
      console.log("/////", response);

      setEditOpen(false);
      setSelectedFile(null);
      if (response.status === 200) {
        toast.success(response.data.message || 'Profile updated successfully!');

        setFormData(updatedFormData);
        if (updatedFormData.profileImage) {
          setPreviewUrl(updatedFormData.profileImage);
        }
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
      console.error("Failed to update user details", error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (confirmPassword !== newPassword) {
        toast.error('New password and confirm password do not match!');
        return;
      }

      if (newPassword.trim() === '') {
        toast.error('Password cannot be empty or contain only spaces.');
        return;
      }

      if (newPassword.length < 6) {
        toast.error('Password must be at least 6 characters long.');
        return;
      }

      const data = {
        currentPassword,
        newPassword,
      };

      const response = await userAxiosInstance.patch(`${API_URL}/user/reset-password/${userInfo?.id}`, data);

      if (response.status === 200) {
        toast.success(response.data.message || 'Password reset successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      console.error(error);

      const errorMessage = error?.response?.data?.message || error?.message || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
    }
  };

  const togglePasswordVisibility = (field: string) => {
    setPasswordVisibility((prev: any) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleCancelEdit = () => {
    setEditOpen(false);
    setSelectedFile(null);
    setPreviewUrl(formData.profileImage || '');
  };

  return (
    <>
      <div className="flex justify-center mt-7">
        <Toaster />
        {!editOpen ? (
          <div className="h-[75vh] bg-white w-[75%] shadow-md rounded-md overflow-y-auto">
            <h1 className="p-5 font-bold text-2xl">Personal Information</h1>


            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 bg-gray-100 flex items-center justify-center">
                  {formData.profileImage ? (
                    <img
                      src={formData.profileImage}
                      alt="Profile"
                      className="w-full h-full object-top"
                    />
                  ) : (
                    <div className="text-gray-500 text-center">
                      <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm">No Photo</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Name
                </label>
                <div className="border border-gray-500 p-2 rounded-md">
                  <h1 className="text-gray-800">{formData.name}</h1>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Email
                </label>
                <div className="border border-gray-500 p-2 rounded-md">
                  <h1 className="text-gray-800">{formData.email}</h1>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Phone
                </label>
                <div className="border border-gray-500 p-2 rounded-md">
                  <h1 className="text-gray-800">{formData.phone}</h1>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Date Of Birth
                </label>
                <div className="border border-gray-500 p-2 rounded-md">
                  <h1 className="text-gray-800">
                    {formData.dob || "Not specified"}
                  </h1>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Gender
                </label>
                <div className="border border-gray-500 p-2 rounded-md">
                  <h1 className="text-gray-800">
                    {formData.gender || "Not specified"}
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex justify-end p-8">
              <button
                onClick={handleEdit}
                className="bg-[#00897B] text-white py-3 px-6 rounded-md hover:bg-[#00796B] font-medium"
              >
                Edit
              </button>
            </div>
          </div>
        ) : (
          <div className="h-[75vh] bg-white w-[75%] shadow-md rounded-md overflow-y-auto">
            <h1 className="p-5 font-bold text-2xl">
              Edit Personal Information
            </h1>


            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 bg-gray-100 flex items-center justify-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-500 text-center">
                      <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm">No Photo</p>
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-[#00897B] text-white p-2 rounded-full cursor-pointer hover:bg-[#00796B]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate}>
              <div className="mt-5 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border border-gray-500 p-2 rounded-md w-full"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    readOnly
                    value={formData.email}
                    onChange={handleChange}
                    className="border border-gray-500 p-2 rounded-md w-full bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="border border-gray-500 p-2 rounded-md w-full"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Date Of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob || ""}
                    onChange={handleChange}
                    className="border border-gray-500 p-2 rounded-md w-full"
                  />
                </div>

                <div>
                  <label
                    htmlFor="gender"
                    className="block mb-1 font-medium text-gray-700"
                  >
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleChange}
                    className="border border-gray-500 p-2 rounded-md w-full"
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 p-8">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white py-3 px-6 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingImage}
                  className="bg-[#00897B] text-white py-3 px-6 rounded-md hover:bg-[#00796B] disabled:bg-gray-400"
                >
                  {isUploadingImage ? 'Uploading...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-5">
        <div className="h-[55vh] bg-white w-[75%] shadow-md rounded-md p-8">
          <h1 className="p-0 font-bold text-2xl">Reset Password</h1>
          <form onSubmit={handleResetPassword} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Old Password</label>
              <div className="relative">
                <input
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  type={passwordVisibility.current ? "text" : "password"}
                  name="oldPassword"
                  className="border border-gray-500 p-2 rounded-md w-full"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {passwordVisibility.current ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">New Password</label>
              <div className="relative">
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type={passwordVisibility.new ? "text" : "password"}
                  name="newPassword"
                  className="border border-gray-500 p-2 rounded-md w-full"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={() => togglePasswordVisibility("new")}
                >
                  {passwordVisibility.new ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={passwordVisibility.confirm ? "text" : "password"}
                  name="confirmPassword"
                  className="border border-gray-500 p-2 rounded-md w-full"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {passwordVisibility.confirm ? "Hide" : "Show"}
                </button>
              </div>
              <div className="col-span-1 md:col-span-2 flex justify-center pt-5">
                <button type="submit" className="bg-[#00897B] text-white py-3 px-6 rounded-md hover:bg-[#00796B]">
                  Reset Password
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default UserProfile;