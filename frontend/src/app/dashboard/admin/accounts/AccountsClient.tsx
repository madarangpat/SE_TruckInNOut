"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { updateUserData } from "@/lib/actions";
import { PencilIcon } from "lucide-react";

const AccountsPage = ({ users }: { users: User[] }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [profilePicture, setprofilePicture] =
    useState("/tinoicon.png"); // Default profile image (User)
  const [editableField, setEditableField] = useState<string | null>(null);
  const [tempData, setTempData] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setTempData(user);
    setDropdownOpen(false);
  };

  const handleEdit = (field: string) => {
    setEditableField(field);
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

  // const handleUserSelect = (user: User) => {
  //   setSelectedUser(user.username);
  //   setSelectedProfileImage(user.profile_image ?? "/tinoicon.png");
    
  //   setOriginalUserData({...user});
    
  //   setUserData({
  //     username: user.username, 
  //     role: user.role, 
  //     cellphone_no: user.cellphone_no,
  //     email: user.email,
  //     philhealth_no: user.philhealth_no,
  //     pag_ibig_no: user.pag_ibig_no,
  //     sss_no: user.sss_no,
  //     license_no: user.license_no,
  //   });
  //   setDropdownOpen(false);
  // };

  const handleSaveChanges = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedUser) return;
    try {
      await updateUserData(selectedUser);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-10">
      <div className="wrapper w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-6 sm:p-8 rounded-xl shadow-lg bg-black/20">
        {/* Profile Image */}
        {/* <div className="flex justify-center mb-3">
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
        </div> */}

        {/* Select User Dropdown */}
        <div className="relative mb-4">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full px-4 py-2 bg-zinc-700/50 backdrop-blur-md text-white rounded-xl flex justify-between items-center shadow-md hover:bg-zinc-700 transition uppercase tracking-widest text-xs sm:text-sm"
          >
            {selectedUser ? selectedUser.username: "Select User"}
            <span>▼</span>
          </button>

          {dropdownOpen && (
            <div className="absolute w-full bg-gray-700 text-white mt-1 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto backdrop-blur-[10px]">
              {users.map((user) => (
                <button
                  key={user.username}
                  onClick={() => handleUserSelect(user)}
                  className="w-full text-left px-4 py-2 hover:bg-black/30 uppercase tracking-widest text-xs sm:text-sm"
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
                    {editableField === field ? (
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
                    {editableField !== field && (
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























  // return (
  //   <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-28">
  //     <div className="wrapper w-full max-w-lg p-6 rounded-xl shadow-lg bg-gray-100">
  //       {/* Dropdown for Selecting User */}
  //       <div className="relative mb-4">
  //         <button
  //           onClick={() => setDropdownOpen(!dropdownOpen)}
  //           className="w-full px-4 py-2 bg-gray-700 text-white rounded-xl flex justify-between items-center shadow-md"
  //         >
  //           {selectedUser ? selectedUser.username : "Select User"}
  //           <span>▼</span>
  //         </button>
  //         {dropdownOpen && (
  //           <div className="absolute w-full bg-gray-700 text-white mt-1 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
  //             {users.map((user) => (
  //               <button
  //                 key={user.username}
  //                 onClick={() => handleUserSelect(user)}
  //                 className="w-full text-left px-4 py-2 hover:bg-gray-600"
  //               >
  //                 {user.username} ({user.role})
  //               </button>
  //             ))}
  //           </div>
  //         )}
  //       </div>

  //       {/* Form Fields for Editing User Information */}
  //       {selectedUser && (
  //         <form onSubmit={handleSaveChanges} className="space-y-4">
  //           {formFields.map((field) => (
  //             <div key={field} className="flex justify-between items-center">
  //               <label className="capitalize text-gray-600">
  //                 {field.replace(/_/g, " ")}
  //               </label>
  //               <div className="flex items-center space-x-2">
  //                 {editableField === field ? (
  //                   <input
  //                     type="text"
  //                     value={tempData ? tempData[field] : ""}
  //                     onChange={(e) => handleInputChange(e, field)}
  //                     className="border border-gray-400 px-2 py-1 text-sm"
  //                   />
  //                 ) : (
  //                   <span className="text-sm text-gray-900">
  //                     {selectedUser[field]}
  //                   </span>
  //                 )}
  //                 {editableField !== field && (
  //                   <button
  //                     type="button"
  //                     className="text-gray-500 text-xs"
  //                     onClick={() => handleEdit(field)}
  //                   >
  //                     ✎
  //                   </button>
  //                 )}
  //                 {editableField === field && (
  //                   <>
  //                     <button
  //                       type="button"
  //                       className="text-green-500 text-xs"
  //                       onClick={() => handleConfirmEdit(field)}
  //                     >
  //                       ✓
  //                     </button>
  //                     <button
  //                       type="button"
  //                       className="text-red-500 text-xs"
  //                       onClick={handleCancelEdit}
  //                     >
  //                       ✗
  //                     </button>
  //                   </>
  //                 )}
  //               </div>
  //             </div>
  //           ))}

  //           {/* Save Changes Button */}
  //           <div className="flex justify-center space-x-4 mt-4">
  //             <button
  //               type="submit"
  //               className="bg-green-600 text-white py-1 px-3 text-sm rounded-lg"
  //             >
  //               Save Changes
  //             </button>
  //           </div>
  //         </form>
  //       )}
  //     </div>
  //   </div>
  // );
};

export default AccountsPage;
