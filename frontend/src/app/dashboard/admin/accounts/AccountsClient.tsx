"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { updateUserData } from "@/lib/actions/user.actions";
import { PencilIcon } from "lucide-react";

const AccountsPage = ({ users }: { users: User[] }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedProfileImage, setSelectedProfileImage] =
    useState("/tinoicon.png");
  const [editableField, setEditableField] = useState<string | null>(null);
  const [tempData, setTempData] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Mark email and cellphone_no as editable
  const editableFields = ["email", "cellphone_no"];

  const formFields = [
    "username", 
    "first_name", 
    "last_name", 
    "email", 
    "role",
    "employee_type", 
    "cellphone_no", 
    "philhealth_no", 
    "pag_ibig_no", 
    "sss_no", 
    "license_no", 
    "profile_image", 
  ];

  const handleUserSelect = (user: User) => {
    console.log("Selected user:", user); // 🔍 Add this
    setSelectedUser(user);
    setSelectedProfileImage(user.profile_image ?? "/tinoicon.png");
    setTempData(user);
    setDropdownOpen(false);
  };

  const handleEdit = (field: string) => {
    if (editableFields.includes(field)) {
      setEditableField(field);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    if (tempData) {
      setTempData({ ...tempData, [field]: event.target.value });
    }
  };

  const handleConfirmEdit = (field: string) => {
    if (selectedUser && tempData) {
      setSelectedUser({ ...selectedUser, [field]: tempData[field] });
      setEditableField(null);
    }
  };

  const handleCancelEdit = () => {
    setEditableField(null);
    setTempData(selectedUser);
  };

  const handleSaveChanges = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedUser || !tempData) return;
  
    // Ensure you have the userId, it should come from selectedUser
    const userId = selectedUser.id;  // Assuming `id` is the user's unique identifier
    console.log("To be updated profile: ",userId);
    try {
      // Call updateUserData with userId, email, and cellphone_no
      await updateUserData({
        userId,  // Pass the userId
        email: tempData.email,
        cellPhoneNo: tempData.cellphone_no,
      });
  
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("There was an error updating the profile.");
    }
  };

  // Handle Profile Image Change for selected user
  const handleProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedProfileImage(reader.result as string); // Update profile image with selected file
      };
      reader.readAsDataURL(file); // Read the image file
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-10">
      <div className="wrapper w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-6 sm:p-8 rounded-xl shadow-lg bg-black/20">
        {/* Profile Image */}
        <div className="flex justify-center mb-3">
          <div className="w-24 sm:w-28 h-24 sm:h-28 bg-white rounded-full flex items-center justify-center border-2 border-black/10 shadow-lg relative overflow-hidden">
            <Image
              src={selectedProfileImage}
              alt="Profile"
              width={100}
              height={100}
              className="rounded-full object-cover"
              unoptimized
            />
          </div>
        </div>

        {/* Profile Image Input for Selected User */}
        <div className="mb-4 text-center">
          <label
            htmlFor="profileImage"
            className="cursor-pointer text-blue-500"
          >
            Change Profile Image
          </label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            className="hidden"
            onChange={handleProfileImageChange}
          />
        </div>

        {/* Select User Dropdown */}
        <div className="relative mb-4">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full px-4 py-2 bg-zinc-700/50 text-white rounded-lg flex justify-between items-center hover:bg-black/40 shadow-md uppercase tracking-widest text-sm"
          >
            {selectedUser ? selectedUser.username : "Select User"}
            <span>▼</span>
          </button>

          {dropdownOpen && (
            <div className="absolute w-full bg-zinc-600 text-white mt-1 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {users.map((user) => (
                <button
                  key={user.username}
                  onClick={() => handleUserSelect(user)}
                  className="w-full text-left px-4 py-2 hover:bg-black/40 uppercase tracking-widest text-sm"
                >
                  {user.username} ({user.role})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Information */}
        <div>
          {selectedUser && (
            <form onSubmit={handleSaveChanges} className="space-y-4">
              {formFields.map((field) => (
                <div key={field} className="flex justify-between items-center">
                  <label className="capitalize text-gray-600">
                    {field.replace(/_/g, " ")}
                  </label>
                  <div className="flex items-center space-x-2">
                    {editableFields.includes(field) &&
                    editableField === field ? (
                      <input
                        type="text"
                        value={tempData ? tempData[field] : ""}
                        onChange={(e) => handleInputChange(e, field)}
                        className="text-stone-950 border border-gray-400 px-2 py-1 text-sm"
                      />
                    ) : (
                      <span className="text-sm text-stone-950">
                        {selectedUser[field]}
                      </span>
                    )}
                    {editableFields.includes(field) &&
                      editableField !== field && (
                        <button
                          className="text-gray-500 text-xs"
                          onClick={() => handleEdit(field)}
                        >
                          <PencilIcon size={16} />
                        </button>
                      )}
                    {editableField === field && (
                      <>
                        <button
                          className="text-green-500 text-xs"
                          onClick={() => handleConfirmEdit(field)}
                        >
                          ✓
                        </button>
                        <button
                          className="text-red-500 text-xs"
                          onClick={handleCancelEdit}
                        >
                          ✗
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {/* Save Changes Button */}
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white py-1 px-3 text-sm rounded-lg"
                >
                  ✓ Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;
