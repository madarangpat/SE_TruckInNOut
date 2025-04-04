"use client";

import React, { useState, useEffect } from "react";
import SettingsOverlayTwo from "@/components/SettingsOverlayTwo";
import { updateSalaryConfiguration } from "@/lib/actions/salary.actions";

const SalaryConfigurationClient = ({
  salConfigs,
}: {
  salConfigs: SalConfig[];
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [salaryData, setSalaryData] = useState<SalConfig>({
    sss: 0.0,
    philhealth: 0.0,
    pag_ibig: 0.0,
    pagibig_contribution: 0.0
  });

  // If salConfig is not empty, set the salary data
  useEffect(() => {
    if (salConfigs && salConfigs.length > 0) {
      const config = salConfigs[0]; // Fetch the first (and only) salary config
      setSalaryData({
        sss: config.sss,
        philhealth: config.philhealth,
        pag_ibig: config.pag_ibig,
        pagibig_contribution: config.pagibig_contribution,
      });
    }
  }, [salConfigs]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setSalaryData({
      ...salaryData,
      [field]: parseFloat(event.target.value) || 0,
    });
  };

  // Handle Saving the Changes
  const handleSaveChanges = async () => {
    const configId = salaryData.id;
    console.log("Config: ", configId);

    if (!configId) {
      console.error("Error: Salary configuration ID is missing.");
      alert("Error: Salary configuration ID is missing.");
      return;
    }

    const body = JSON.stringify({
      sss: salaryData.sss,
      philhealth: salaryData.philhealth,
      pag_ibig: salaryData.pag_ibig,
      pagibig_contribution: salaryData.pagibig_contribution,
    });

    await updateSalaryConfiguration(body, configId)
  };

  // Check if there are any changes made to the salary data
  const hasChanges =
    salaryData.sss !== salConfigs[0]?.sss ||
    salaryData.philhealth !== salConfigs[0]?.philhealth ||
    salaryData.pag_ibig !== salConfigs[0]?.pag_ibig;
    salaryData.pagibig_contribution !== salConfigs[0]?.pagibig_contribution

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-10">
      <div className="wrapper w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-4 sm:p-6 rounded-xl shadow-lg bg-black/20">
        <h1 className="text-center text-lg sm:text-xl md:text-2xl font-semibold text-black/50 mb-3 tracking-[0.1em]">
          SALARY CONFIGURATION
        </h1>

        {/* Salary Configuration Table (Editable Fields) */}
        <div className="p-3 text-black/80 text-xs sm:text-sm">
          {Object.entries(salaryData).map(([key, value], index) => (
            <div
              key={index}
              className="flex justify-between items-center py-1 border-b-2 border-black/10"
            >
              <span className="text-black/80">
                {key.replace(/_/g, " ").replace(/([A-Z])/g, " $1")}
              </span>
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
            className={`px-4 sm:px-6 py-2 ${
              !hasChanges ? "bg-gray-400" : "bg-[#668743]"
            } text-white text-xs sm:text-sm rounded-lg hover:bg-[#345216] tracking-wide`}
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

      {showSettings && (
        <SettingsOverlayTwo onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

export default SalaryConfigurationClient;
