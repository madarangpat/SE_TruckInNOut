"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import SettingsOverlayTwo from "@/components/SettingsOverlayTwo";

const SalaryConfigurationClient = ({ salConfig }: { salConfig: SalConfig[] }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSalConfig, setSelectedSalConfig] = useState<string | null>(null);
  const [selectedEmployeeImage, setSelectedEmployeeImage] = useState("/accountsblk.png"); // Default image
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [editableField, setEditableField] = useState<string | null>(null);
  // const [employees, setEmployees] = useState<{ name: string; image: string }[]>(
  //   []
  // );

  const [salaryData, setSalaryData] = useState<SalConfig>({
      username: "",
      role: "N/A",
      sss: 0.0,
      philhealth: 0.0,
      pag_ibig: 0.0,
      vale: 0.0,
      sss_loan: 0.0,
      pag_ibig_loan: 0.0,
      cash_advance: 0.0,
      cash_bond: 0.0,
      charges: 0.0,
      others: 0.0,
      overtime: 0.0,
      additionals: 0.0,
    });

    const handleSalConfigSelect = (salConfig: SalConfig) => {
      setSelectedSalConfig(salConfig.username ?? null);
      setSalaryData({
        username: salConfig.username,
        role: salConfig.role,
        sss: salConfig.sss,
        philhealth: salConfig.philhealth,
        pag_ibig: salConfig.pag_ibig,
        vale: salConfig.vale,
        sss_loan: salConfig.sss_loan,
        pag_ibig_loan: salConfig.pag_ibig_loan,
        cash_advance: salConfig.cash_advance,
        cash_bond: salConfig.cash_bond,
        charges: salConfig.charges,
        others: salConfig.others,
        overtime: salConfig.overtime,
        additionals: salConfig.additionals,       
      });
      setDropDownOpen(false);
    };

    console.log("Salary Config Data:", salConfig);


  // // Salary Fields State
  // const [salaryData, setSalaryData] = useState<SalConfig>(
  //   Object.fromEntries(
  //     [
  //       "SSS",
  //       "Philhealth",
  //       "Pag-IBIG",
  //       "Vale",
  //       "SSS Loan",
  //       "Pag-IBIG Loan",
  //       "Cash Advance",
  //       "Cash Bond",
  //       "Charges",
  //       "Others",
  //       "Overtime",
  //       "Additionals"
  //     ].map((item) => [item, "XXX"])
  //   )
  // );
  

  
  // Simulating fetching employees from backend
  // useEffect(() => {
  //   const fetchEmployees = async () => {
  //     const employeeData = [
  //       { name: "Harley Lopez", image: "/tinoicon.png" },
  //       { name: "Patrick Madarang", image: "/tinowlabel2.png" },
  //       { name: "Luis Sevilla", image: "/tinoicon.png" },
  //       { name: "Anaquin Gomez", image: "/tinowlabel2.png" },
  //       { name: "Carl Jacob", image: "/tinoicon.png" },
  //       { name: "Reginald Co", image: "/tinowlabel2.png" },
  //     ];
  //     setEmployees(employeeData);
  //   };

  //   fetchEmployees();
  // }, []);

  // Handle Employee Selection
  // const handleUserSelect = (name: string, image: string) => {
  //   setSelectedEmployee(name);
  //   setSelectedEmployeeImage(image);
  //   setEmployeeDropdownOpen(false);
  // };

  // Handle Editing Fields
  // const handleEdit = (field: string) => {
  //   setEditableField(field);
  // };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setSalaryData({ 
      ...salaryData, 
      [field]: parseFloat(event.target.value) || 0, 
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-10">
      <div className="wrapper w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-4 sm:p-6 rounded-xl shadow-lg bg-black/20">
        {/* Title */}
        <h1 className="text-center text-lg sm:text-xl md:text-2xl font-semibold text-black/50 mb-3 tracking-[0.1em]">
          SALARY CONFIGURATION
        </h1>

        {/* Employee Image
        <div className="flex justify-center mb-2">
          <div className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-white rounded-full flex items-center justify-center border-4 border-gray-400 shadow-lg">
            <Image
              src={selectedEmployeeImage}
              alt="Profile"
              width={70}
              height={70}
              className="rounded-full object-cover opacity-90"
            />
          </div>
        </div> */}

        {/* Select Employee Dropdown */}
        <div className="relative mb-3">
          <button
            onClick={() => setDropDownOpen(!dropDownOpen)}
            className="innerwrapper w-full px-4 py-2 sm:py-2.5 bg-gray-800 text-white rounded-lg flex justify-between items-center hover:bg-gray-700 shadow-md uppercase tracking-widest text-xs sm:text-sm"
          >
            {selectedSalConfig || "Select Salary Configuration"}
            <span>▼</span>
          </button>

          {dropDownOpen && (
            <div className="dropwrapper absolute w-full bg-gray-700 text-white mt-1 rounded-lg shadow-lg z-10 max-h-40 sm:max-h-52 overflow-y-auto backdrop-blur-[10px]">
              {salConfig.map((salConfig) => (
                <button
                  key={salConfig.username}
                  onClick={() => handleSalConfigSelect(salConfig)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-600 uppercase tracking-widest text-xs sm:text-sm"
                >
                  {salConfig.username} ({salConfig.role})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Salary Configuration Table (Editable Fields) */}
        <div className="p-3 text-black/80 text-xs sm:text-sm">
          {Object.entries(salaryData).map(([key, value], index) => (
            <div
              key={index}
              className="flex justify-between items-center py-1 border-b-2 border-black/5"
            >
              <span className="text-black/40">
                {key.replace(/_/g, " ").replace(/([A-Z])/g, " $1")}
              </span>
              <span className="text-black text-xs sm:text-sm">{value}</span>
              {/* <div className="flex items-center space-x-2">
                {editableField === item ? (
                  <input
                    type="text"
                    value={salaryData[item]}
                    onChange={(e) => handleInputChange(e, item)}
                    className="border-b border-gray-400 text-black text-xs sm:text-sm w-20 sm:w-28 px-2 outline-none"
                    onBlur={() => setEditableField(null)}
                  />
                ) : (
                  <span className="text-black text-xs sm:text-sm">
                    {salaryData[item]}
                  </span>
                )}
                <button
                  className="text-gray-500 hover:text-black"
                  onClick={() => handleEdit(item)}
                >
                  <Image
                    className="opacity-50"
                    src="/pencil.png"
                    alt="Edit"
                    width={15}
                    height={15}
                  />
                </button>
              </div> */}
            </div>
          ))}
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-center mt-4">
          <button className="px-4 sm:px-6 py-2 bg-[#668743] text-white text-xs sm:text-sm rounded-lg hover:bg-[#345216] tracking-wide">
            Save Changes
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

      {/* Display Overlay if showSettings is true */}
      {showSettings && <SettingsOverlayTwo onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default SalaryConfigurationClient;

