"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import SettingsOverlayTwo from "@/components/SettingsOverlayTwo";

const VehicleDataClient = ({ vehicles }: { vehicles: Vehicle[] }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Handle Vehicle Selection
  const [vehicleData, setVehicleData] = useState<Vehicle>({
    plate_number: undefined,
    vehicle_type: "",
    is_company_owned: true,
    subcon_name: undefined
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-10">
      <div className="wrapper w-full max-w-md p-6 sm:p-8 rounded-xl shadow-lg bg-black/20">
        {/* Header with Title and Logo */}
        <div className="flex justify-between items-start mb-4">
          {/* Left Title */}
          <div>
            <h2 className="uppercase text-xl sm:text-3xl md:text-4xl font-bold text-black/70">
              Vehicle List
            </h2>
            <p className="text-black/70 text-sm sm:text-sm mt-1">
              Browse through company and private vehicles.
            </p>
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
                    Ownership: {vehicle.is_company_owned ? "Company Owned" : "Private"}
                  </p>
                  {!vehicle.is_company_owned && vehicle.subcon_name && (
                    <p className="text-sm text-black/70">
                      Subcon Name: {vehicle.subcon_name}
                    </p>
                  )}
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
