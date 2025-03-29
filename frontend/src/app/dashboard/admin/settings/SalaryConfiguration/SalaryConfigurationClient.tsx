"use client";

import React, { useState, useEffect } from "react";
import SettingsOverlayTwo from "@/components/SettingsOverlayTwo";
import { getSession } from "@/lib/auth";

const SalaryConfigurationClient = ({ salConfig }: { salConfig: SalConfig[] }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [salaryData, setSalaryData] = useState<SalConfig>({
    sss: 0.0,
    philhealth: 0.0,
    pag_ibig: 0.0,
  });

  // If salConfig is not empty, set the salary data
  useEffect(() => {
    if (salConfig && salConfig.length > 0) {
      const config = salConfig[0]; // Fetch the first (and only) salary config
      setSalaryData({
        sss: config.sss,
        philhealth: config.philhealth,
        pag_ibig: config.pag_ibig,
      });
    }
  }, [salConfig]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setSalaryData({
      ...salaryData,
      [field]: parseFloat(event.target.value) || 0,
    });
  };

  // Handle Saving the Changes
  const handleSaveChanges = async () => {
    const session = getSession();
    const url = `${process.env.DOMAIN}/salary-configurations/1/`; // Assuming there's only one configuration (id = 1)
    const requestOptions: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access!}`,
      },
      body: JSON.stringify(salaryData),
    };

    try {
      const response = await fetch(url, requestOptions);
      if (response.ok) {
        alert("Salary Configuration updated successfully!");
      } else {
        alert("Failed to update Salary Configuration.");
      }
    } catch (error) {
      console.error("Error updating Salary Configuration:", error);
      alert("An error occurred while saving changes.");
    }
  };

  // Check if there are any changes made to the salary data
  const hasChanges = salaryData.sss !== salConfig[0]?.sss || salaryData.philhealth !== salConfig[0]?.philhealth || salaryData.pag_ibig !== salConfig[0]?.pag_ibig;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-10">
      <div className="wrapper w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-4 sm:p-6 rounded-xl shadow-lg bg-black/20">
        <h1 className="text-center text-lg sm:text-xl md:text-2xl font-semibold text-black/50 mb-3 tracking-[0.1em]">
          SALARY CONFIGURATION
        </h1>

        {/* Salary Configuration Table (Editable Fields) */}
        <div className="p-3 text-black/80 text-xs sm:text-sm">
          {Object.entries(salaryData).map(([key, value], index) => (
            <div key={index} className="flex justify-between items-center py-1 border-b-2 border-black/5">
              <span className="text-black/40">{key.replace(/_/g, " ").replace(/([A-Z])/g, " $1")}</span>
              <input
                type="number"
                value={value}
                onChange={(e) => handleInputChange(e, key)}
                className="border-b border-gray-400 text-black text-xs sm:text-sm w-20 sm:w-28 px-2 outline-none"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={handleSaveChanges}
            disabled={!hasChanges} // Disable if no changes
            className={`px-4 sm:px-6 py-2 ${!hasChanges ? "bg-gray-400" : "bg-[#668743]"} text-white text-xs sm:text-sm rounded-lg hover:bg-[#345216] tracking-wide`}
          >
            Save Changes
          </button>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setShowSettings(true)}
            className="px-4 py-2 text-black/80 border border-black/40 rounded-lg hover:bg-gray-200 transition"
          >
            ← Back to Settings
          </button>
        </div>
      </div>

      {showSettings && <SettingsOverlayTwo onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default SalaryConfigurationClient;
