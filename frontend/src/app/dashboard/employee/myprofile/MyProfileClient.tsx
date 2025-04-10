"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { logout } from "@/auth/auth.actions";
import { PencilIcon } from "lucide-react";
import {
  updateUserData,
  uploadProfilePicture,
} from "@/lib/actions/user.actions";
import { toast } from "sonner";

const MyProfileClient = ({ user }: { user: User }) => {
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [editableField, setEditableField] = useState<string | null>(null);
  const [employeeData, setEmployeeData] = useState<User>({ 
    ...user,
    user_id: user.user_id || user.id,
  });
  const [tempData, setTempData] = useState<User>({ 
    ...user,
    user_id: user.user_id || user.id, 
  });

  const hasChanges =
  employeeData.email !== user.email ||
  employeeData.cellphone_no !== user.cellphone_no;


  const formFields = [
    "username",
    "email",
    "first_name",
    "last_name",
    "role",
    "cellphone_no",
    "philhealth_no",
    "pag_ibig_no",
    "license_no",
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  const handleProfilePictureChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("profilePicture", file);

      const data = await uploadProfilePicture(formData);
      setProfilePicture(data.profilePicture);
    }
  };

  const handleEdit = (field: string) => {
    if (field === "email" || field === "cellphone_no") {
      setEditableField(field);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setTempData({ ...tempData, [field]: event.target.value });
  };

  const handleConfirmEdit = (field: string) => {
    setEmployeeData({ ...employeeData, [field]: tempData[field] });
    setEditableField(null);
  };

  const handleCancelEdit = () => {
    setEditableField(null);
    setTempData({ ...employeeData });
  };

  const handleSaveChanges = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await updateUserData({
        userId: employeeData.user_id.toString(),
        email: employeeData.email,
        cellphone_no: employeeData.cellphone_no,
      });
      toast.success("Profile updated successfully!");
      setEditableField(null);
    } catch (error) {
      toast.error("Error updating profile:");
    }
  };
  

  return (
    <div className="min-h-100vh flex flex-col items-center justify-center px-4 pt-28">
      <div className="wrapper w-full max-w-lg p-6 rounded-xl shadow-lg bg-gray-100">
        {/* Profile Image Upload */}
        <div className="flex justify-center mb-4 relative">
          <label htmlFor="profile-upload" className="cursor-pointer relative">
            <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              {profilePicture || user?.profile_image ? (
                <Image
                  src={profilePicture || user?.profile_image || ""}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="rounded-full object-cover"
                />
              ) : (
                <span className="text-sm">Click to Add Profile Picture</span>
              )}
            </div>
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePictureChange}
          />
        </div>

        {/* Employee Information Form */}
        <form onSubmit={handleSaveChanges} className="space-y-4">
          {formFields.map((field) => (
            <div key={field} className="flex justify-between items-center">
              <label className="capitalize text-gray-600">
                {field.replace(/_/g, " ")}
              </label>

              <div className="flex items-center space-x-2">
                {/* Make 'role' and other fields read-only */}
                {field === "role" || !(field === "email" || field === "cellphone_no") ? (
                  <span className="text-sm text-stone-950">
                    {employeeData[field]}
                  </span>
                ) : editableField === field ? (
                  <input
                    type="text"
                    value={tempData[field] || ""}
                    onChange={(e) => handleInputChange(e, field)}
                    className="text-stone-950 border border-gray-400 px-2 py-1 text-sm"
                    autoFocus
                  />
                ) : (
                  <span className="text-sm text-stone-950">
                    {employeeData[field]}
                  </span>
                )}

                {/* Edit button only for email and cellphone_no */}
                {editableField !== field &&
                  (field === "email" || field === "cellphone_no") && (
                    <button
                      type="button"
                      className="text-gray-500 text-xs"
                      onClick={() => handleEdit(field)}
                    >
                      <PencilIcon size={16} />
                    </button>
                  )}

                {/* Confirm/Cancel buttons */}
                {editableField === field &&
                  (field === "email" || field === "cellphone_no") && (
                    <>
                      <button
                        type="button"
                        className="text-green-500 text-xs"
                        onClick={() => handleConfirmEdit(field)}
                      >
                        ✓
                      </button>
                      <button
                        type="button"
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

          <div className="flex justify-center space-x-4 mt-4">
            <button
              type="submit"
              disabled={!hasChanges}
              className={`py-1 px-3 text-s rounded-lg ${
                hasChanges
                  ? "bg-[#668743] text-white hover:bg-[#345216]"
                  : "bg-gray-400 text-white cursor-not-allowed"
              }`}
            >
              ✓ Save Changes
            </button>
          </div>
        </form>

        <div className="flex flex-col items-center space-y-2 mt-2">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center bg-red-600 text-white py-1 px-3 text-s rounded-lg hover:bg-red-800 w-32"
          >
            <Image
              src="/logoutt.png"
              alt="Logout"
              width={25}
              height={25}
              className="mr-2"
            />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfileClient;
