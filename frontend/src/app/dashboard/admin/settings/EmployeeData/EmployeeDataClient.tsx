"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import SettingsOverlayTwo from "@/components/SettingsOverlayTwo";

const EmployeeDataClient = ({ users }: { users: User[] }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedProfileImage, setSelectedProfileImage] =
    useState("/tinoicon.png");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Handle User Selection
  const [userData, setUserData] = useState<User>({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    cellphone_no: "",
    philhealth_no: "",
    pag_ibig_no: "",
    sss_no: "",
    license_no: "",
    profile_image: "", // default profile image
    employee_type: "", // default employee type
    role: "",   
  });

  const handleUserSelect = (user: User) => {
    setSelectedUser(user.username);
    setSelectedProfileImage(user.profile_image ?? "/tinoicon.png");
    setUserData({
      username: user.username, 
      role: user.role, 
      email: user.email, 
      first_name: user.first_name,
      last_name: user.last_name,
      cellphone_no: user.cellphone_no,
      philhealth_no: user.philhealth_no,
      pag_ibig_no: user.pag_ibig_no,
      sss_no: user.sss_no,
      license_no: user.license_no,
      profile_image: user.profile_image, // ensure profile_image is updated
      employee_type: user.employee_type, // use the selected user's employee_type or default to "Driver"
           
    });
    setDropdownOpen(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-10">
      <div className="wrapper w-full max-w-md p-6 sm:p-8 rounded-xl shadow-lg bg-black/20">
        {/* Profile Image */}
        <div className="flex justify-center mb-3">
          <div className="w-24 sm:w-28 h-24 sm:h-28 bg-white rounded-full flex items-center justify-center border border-gray-300 shadow-lg relative overflow-hidden">
            <Image
              src={selectedProfileImage}
              alt="Profile"
              width={100}
              height={100}
              className="rounded-full object-cover"
              unoptimized // Ensures proper loading of external images
            />
          </div>
        </div>

        {/* Select User Dropdown */}
        <div className="relative mb-4">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full px-4 py-2 bg-zinc-700/50 backdrop-blur-md text-white rounded-xl flex justify-between items-center shadow-md hover:bg-zinc-700 transition uppercase tracking-widest text-xs sm:text-sm"
          >
            {selectedUser || "Select User"}
            <span>▼</span>
          </button>

          {dropdownOpen && (
            <div className="absolute w-full bg-zinc-700/70 text-white mt-1 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto backdrop-blur-[10px]">
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
        <div className="p-3 text-black/80 text-xs sm:text-sm">
          {Object.entries(userData).map(([key, value], index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b-2 border-black/70"
            >
              <span className="text-black/80 capitalize">
                {key.replace(/_/g, " ").replace(/([A-Z])/g, " $1")}
              </span>
              <span className="text-black text-xs sm:text-sm">{value}</span>
            </div>
          ))}

          {/* Back Button */}
          <div className="mt-6">
            <button
              onClick={() => setShowSettings(true)}
              className="px-4 py-2 text-black/80 border border-black/40 rounded-lg hover:bg-gray-200 transition"
            >
              ← Back to Settings
            </button>
          </div>
        </div>
      </div>

      {/* Display Overlay if showSettings is true */}
      {showSettings && (
        <SettingsOverlayTwo onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

export default EmployeeDataClient;
