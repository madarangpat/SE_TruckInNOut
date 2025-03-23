"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import SettingsOverlayTwo from "@/components/SettingsOverlayTwo";

const VehicleDataClient = ({ vehicles }: { vehicles: Vehicle[] }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");

  // Handle Vehicle Selection
  const [vehicleData, setVehicleData] = useState<Vehicle>({
    plate_number: undefined,
    vehicle_type: "",
    is_company_owned: true,
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-10">
      <div className="wrapper w-full max-w-md p-6 sm:p-8 rounded-xl shadow-lg bg-black/20">
        {/* Title */}
        <h2 className="text-2xl font-bold text-black/70 text-center mb-4 uppercase">
          Vehicle List
        </h2>

        {/* Vehicle Information */}
        <div className="p-3 text-black/80 text-xs sm:text-sm space-y-4">
          <div className="overflow-y-auto max-h-[20rem]">
            {vehicles.length > 0 ? (
              vehicles.map((vehicle, index) => (
                <div key={index} className="border-b-2 border-black/5 pb-3">
                  <p className="text-lg font-semibold text-black">
                    {vehicle.plate_number || "No Plate Number"}
                  </p>
                  <p className="text-sm text-black/70">
                    Type: {vehicle.vehicle_type || "Unknown"}
                  </p>
                  <p className="text-sm text-black/70">
                    Ownership:{" "}
                    {vehicle.is_company_owned ? "Company Owned" : "Private"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-black/50">No vehicles found.</p>
            )}
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
      </div>

      {/* Display Overlay if showSettings is true */}
      {showSettings && (
        <SettingsOverlayTwo onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

export default VehicleDataClient;
