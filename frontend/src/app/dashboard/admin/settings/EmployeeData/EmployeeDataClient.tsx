"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const EmployeeDataClient = ({ users }: { users: User[] }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedProfileImage, setSelectedProfileImage] =
    useState("/tinoicon.png");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const router = useRouter();


  // Handle User Selection
  const [userData, setUserData] = useState<User | undefined>(undefined);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user.username);
    setSelectedProfileImage(user.profile_image ?? "/tinoicon.png");
    setUserData({
      ...user
    });
    setDropdownOpen(false);
  };

  const filteredUsers = users.filter(user => user.role === "employee");

  // Handle dropdown toggle
  const handleDropdownToggle = () => {
    if (filteredUsers.length === 0) {
      // Display toast if no employees are found
      toast.error("No employees available to select.");
    } else {
      setDropdownOpen(!dropdownOpen);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-10">
      <div className="wrapper w-full max-w-md p-6 sm:p-8 rounded-xl shadow-lg bg-black/20">
        {/* Header with Title and Logo */}
        <div className="flex justify-between items-start mb-4">
          {/* Left Title */}
          <div>
            <h2 className="uppercase text-xl sm:text-3xl md:text-4xl font-bold text-black/70">
              Employee Data
            </h2>
          </div>
          {/* Top-right Logo */}
          <div className="w-10 h-10 relative">
            <Image
              src="/tinoicon.png"
              alt="Tinoicon Logo"
              layout="fill"
              className="object-contain"
              unoptimized
            />
          </div>
        </div>

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
            onClick={handleDropdownToggle}
            className="w-full px-4 py-2 bg-zinc-700/50 backdrop-blur-md text-white rounded-xl flex justify-between items-center shadow-md hover:bg-zinc-700 transition uppercase tracking-widest text-xs sm:text-sm"
          >
            {selectedUser || "Select User"}
            <span>▼</span>
          </button>

          {dropdownOpen && (
            <div className="absolute w-full bg-white text-black mt-1 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto backdrop-blur-[10px]">
              {filteredUsers.map((user) => (
                <button
                  key={user.username}
                  onClick={() => handleUserSelect(user)}
                  className="w-full text-left px-4 py-2 hover:bg-black/30 uppercase tracking-widest text-xs sm:text-sm"
                >
                  {user.username} ({user.employee_type})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Information */}
        <div className="p-3 text-black/80 text-xs sm:text-sm">
          {userData ? (
            Object.entries(userData)
              .filter(([key]) => key !== "id" && key !== "profile_image") // Exclude id and profile_image
              .map(([key, value], index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b-2 border-black/70"
                >
                  <span className="text-black/80 capitalize">
                    {key.replace(/_/g, " ").replace(/([A-Z])/g, " $1")}
                  </span>
                  <span className="text-black text-xs sm:text-sm">
                    {value?.toString() || "N/A"}
                  </span>
                </div>
              ))
          ) : (
            <div className="py-4 text-center text-black/60">
              Select a user to view details
            </div>
          )}

          {/* Back Button */}
          <div className="mt-6">
            <button
              onClick={() => router.push("/dashboard/admin/accounts")}
              className="px-4 py-2 text-black/80 border border-black/40 rounded-lg hover:bg-gray-200 transition"
            >
              ← Back to Accounts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDataClient;
