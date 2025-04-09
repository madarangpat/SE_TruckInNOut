"use client";

import React, { useState } from "react";
import Image from "next/image";
import SettingsOverlayTwo from "@/components/SettingsOverlayTwo";

const DeleteVehicleClient = ({ vehicles }: { vehicles: Vehicle[] }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [vehicleList, setVehicleList] = useState(vehicles);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDropdownOpen(false);
  };

  const handleDeleteVehicle = async () => {
    if (!selectedVehicle?.plate_number) {
      alert("No vehicle selected.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/delete-vehicle-by-plate/${selectedVehicle.plate_number}/`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        alert(`Deleted ${selectedVehicle.plate_number}`);
        setVehicleList(
          vehicleList.filter(
            (v) => v.plate_number !== selectedVehicle.plate_number
          )
        );
        setSelectedVehicle(null);
        setShowOverlay(false);
      } else {
        alert("Failed to delete vehicle");
      }
    } catch (error) {
      alert("An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-10">
      <div className="wrapper w-full max-w-md p-6 sm:p-8 rounded-xl shadow-lg bg-black/20">
        {/* Header Section with Title and Logo */}
          <div className="flex justify-between items-end mx-3 gap-2 mb-2">
            <h2 className="uppercase text-xl sm:text-3xl font-bold text-black/70">
              Delete Account
            </h2>
            <Image
              src="/tinowlabel2.png"
              alt="Logo"
              width={80}
              height={80}
              className="w-12 sm:w-16 md:w-20 h-auto opacity-100"
            />
          </div>

        <p className="px-3 text-start text-[8px] sm:text-base font-medium text-black/50 mb-4">
          Clearing the road for new journeys.
        </p>

        {/* Dropdown */}
        <div className="relative mb-4">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full px-4 py-2 bg-zinc-700/50 text-white rounded-xl flex justify-between items-center shadow-md hover:bg-zinc-700 uppercase tracking-widest text-xs sm:text-sm"
          >
            {selectedVehicle?.plate_number || "Select Vehicle Plate"}
            <span>▼</span>
          </button>
          {dropdownOpen && (
            <div className="absolute w-full bg-white text-black mt-1 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {vehicleList.map((vehicle) => (
                <button
                  key={vehicle.plate_number}
                  onClick={() => handleVehicleSelect(vehicle)}
                  className="w-full text-left px-4 py-2 hover:bg-black/30 uppercase tracking-widest text-xs sm:text-sm"
                >
                  {vehicle.plate_number}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Delete Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => selectedVehicle && setShowOverlay(true)}
            className="w-full bg-red-600 hover:bg-red-800 text-white py-2 rounded-lg text-sm font-semibold"
          >
            DELETE VEHICLE
          </button>
        </div>

        {/* Back to Settings */}
        <div className="text-center">
          <button
            onClick={() => setShowSettings(true)}
            className="px-4 py-2 text-black/80 border border-black/40 rounded-lg hover:bg-gray-200 transition"
          >
            ← Back to Settings
          </button>
        </div>
      </div>

      {/* Confirmation Overlay */}
      {showOverlay && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/10 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={(e) => e.target === e.currentTarget && setShowOverlay(false)}
        >
          <div className="bg-white text-black p-6 rounded-xl shadow-xl w-11/12 sm:w-2/3 lg:w-1/3 text-center">
            <h2 className="text-xl font-bold mb-2">⚠ WARNING</h2>
            <p className="mb-4">
              You are about to delete{" "}
              <strong>{`${selectedVehicle?.plate_number}'s`}</strong> record.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteVehicle}
                className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded-lg"
              >
                PROCEED
              </button>
              <button
                onClick={() => setShowOverlay(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <SettingsOverlayTwo onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

export default DeleteVehicleClient;
