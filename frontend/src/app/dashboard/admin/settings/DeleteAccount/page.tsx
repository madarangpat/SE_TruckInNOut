"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import SettingsOverlayTwo from "@/components/SettingsOverlayTwo";
import { fetchEmployees } from "@/lib/api";

const DeleteAccount = () => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedEmployeeImage, setSelectedEmployeeImage] = useState("/accountsblk.png"); // Default profile image
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [employees, setEmployees] = useState<{ name: string; image: string; id: number }[]>([]);
  const [showOverlay, setShowOverlay] = useState(false); // Overlay state
  const [showSettings, setShowSettings] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Simulating fetching employees from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      // Fetch employees from the backend (replace this with the actual API endpoint)
      const response = await fetch("/api/users/");  // Replace with actual API call to get users
      const data = await response.json();
      
      const employeeList = data.users.map((user: any) => ({
        name: user.username,  // Assuming username is used for display
        image: user.profile_image || "/accountsblk.png",  // Use actual image or a default
        id: user.id,  // Assuming each user has a unique 'id'
      }));
      
      setEmployees(employeeList);
    };

    fetchEmployees();
  }, []);

  // Handle Employee Selection
  const handleEmployeeSelect = (name: string, image: string, id: number) => {
    setSelectedEmployee(name);
    setSelectedEmployeeImage(image);
    setSelectedEmployeeId(id); // Store the selected employee's id
    setDropdownOpen(false);
  };

  // Show Overlay
  const handleDeleteClick = () => {
    if (!selectedEmployeeId) {
      alert("Please select an employee to delete.");
      return;
    }
    setShowOverlay(true);
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    if (!selectedEmployeeId) {
      alert("No employee selected.");
      return;
    }

    try {
      const response = await fetch(`/api/delete-user/${selectedEmployeeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert(`Account for ${selectedEmployee} has been deleted.`);
        setShowOverlay(false); // Close overlay after deletion
        setSelectedEmployee("");  // Clear the selected employee
        setSelectedEmployeeImage("/accountsblk.png");  // Reset the image
        setSelectedEmployeeId(null);  // Reset the ID
        // Optionally, refresh the employee list to reflect the change
        await fetchEmployees();
      } else {
        const data = await response.json();
        alert(data.message || "Something went wrong.");
      }
    } catch (error) {
      alert("An error occurred while deleting the account.");
    }
  };

  // Close overlay when clicking outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if ((e.target as Element).id === "overlayBackground") {
      setShowOverlay(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-10 relative">
      <div className="wrapper w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-6 sm:p-8 rounded-xl shadow-lg bg-black/20 relative">
        {/* TruckIn-N-Out Logo */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2">
          <Image
            src="/tinoicon.png" // TruckIn-N-Out logo
            alt="TruckIn-N-Out Logo"
            width={25}
            height={25}
            className="opacity-100 sm:w-10 h-auto"
          />
          <span className="text-xs sm:text-sm font-semibold text-black">
            TruckIn-N-Out
          </span>
        </div>

        {/* Title */}
        <h1 className="text-center mt-11 text-lg sm:text-xl md:text-2xl font-semibold text-black/70 mb-2 tracking-[0.1em]">
          DELETE ACCOUNT
        </h1>
        <p className="text-center text-xs sm:text-sm text-black/50 mb-7">
          The truck may stop here, but the road ahead is wide open
        </p>

        {/* Profile Image */}
        <div className="flex justify-center mb-9">
          <div className="w-24 sm:w-28 h-24 sm:h-28 bg-white rounded-full flex items-center justify-center border-4 border-gray-400 shadow-lg">
            <Image
              src={selectedEmployeeImage}
              alt="Profile"
              width={90}
              height={90}
              className="rounded-full object-cover opacity-90"
            />
          </div>
        </div>

        {/* Select Employee Dropdown */}
        <div className="relative mb-6">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="innerwrapper w-full px-4 py-2 bg-gray-800 text-white rounded-lg flex justify-between items-center hover:bg-black/20 shadow-md uppercase tracking-widest text-xs sm:text-sm"
          >
            {selectedEmployee || "Select Employee Name"}
            <span>▼</span>
          </button>
          {dropdownOpen && (
            <div className="dropwrapper absolute w-full bg-gray-700 text-white mt-1 rounded-lg shadow-lg z-10 max-h-48 sm:max-h-60 overflow-y-auto backdrop-blur-[10px]">
              {employees.map((emp, index) => (
                <button
                  key={index}
                  onClick={() => handleEmployeeSelect(emp.name, emp.image, emp.id)}
                  className="w-full text-left px-4 py-2 hover:bg-black/20 uppercase tracking-widest text-xs sm:text-sm"
                >
                  {emp.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Delete Button */}
        <div className="flex justify-center">
          <button
            onClick={handleDeleteClick}
            className="w-4/5 sm:w-3/4 bg-red-600 text-white py-2 sm:py-3 rounded-lg text-xs sm:text-lg font-semibold hover:bg-red-800"
          >
            DELETE ACCOUNT
          </button>
        </div>

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

      {/* ✅ Settings Overlay - Now Works the Same as Other Pages */}
      {showSettings && (
        <SettingsOverlayTwo onClose={() => setShowSettings(false)} />
      )}

      {/* Warning Overlay */}
      {showOverlay && (
        <div
          id="overlayBackground"
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/10 backdrop-blur-sm z-50"
          onClick={handleOverlayClick} // Close when clicking outside
        >
          <div className="innerwrapper text-white p-6 sm:p-8 rounded-lg w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 text-center shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={() => setShowOverlay(false)}
              className="absolute top-4 right-6 text-gray-400 hover:text-white text-lg"
            >
              ✖
            </button>

            {/* Warning Header */}
            <h2 className="text-xl sm:text-2xl font-bold mb-2">⚠ WARNING!</h2>
            <p className="text-sm sm:text-md mb-2">
              You are about to DELETE a USER PROFILE.
            </p>

            {/* Note */}
            <p className="text-xs sm:text-sm text-gray-300 mb-4">
              Note: This will only remove an employee’s access to the account
              deleted.
            </p>

            {/* Proceed with Deletion */}
            <p className="text-sm sm:text-md font-semibold mb-6">
              Proceed with DELETION?
            </p>

            {/* Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold"
              >
                PROCEED
              </button>
              <button
                onClick={() => setShowOverlay(false)}
                className="bg-white text-black border border-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
