"use client";

import { IoClose } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";

const SettingsOverlayTwo = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-[9999]">
      
      {/* Overlay Container */}
      <div className="bg-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl w-[400px] sm:w-[450px] max-w-full relative border border-white/20">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg sm:text-xl font-semibold tracking-wide text-white uppercase">
            SETTINGS
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-300 hover:text-white transition-transform transform hover:scale-110"
          >
            <IoClose size={28} />
          </button>
        </div>

        {/* Settings Options */}
        <ul className="space-y-5">
          {[
            { href: "/dashboard/admin/settings/CompanyInformation", icon: "/info.png", label: "Company Information" },
            { href: "/dashboard/admin/settings/EmployeeData", icon: "/usergroups.png", label: "Employee Data" },
            { href: "/dashboard/admin/settings/VehicleData", icon: "/manycars.png", label: "Vehicle Data" },
            // { href: "/dashboard/admin/settings/SalaryConfiguration", icon: "/payroll.png", label: "Salary Configuration" },
            { href: "/dashboard/admin/settings/AddAccount", icon: "/plustrip2.png", label: "Add Account" },
            { href: "/dashboard/admin/settings/AddVehicle", icon: "/truck2.png", label: "Add Vehicle" },
            { href: "/dashboard/admin/settings/DeleteAccount", icon: "/remove.png", label: "Delete Account", isDanger: true },
            { href: "/dashboard/admin/settings/DeleteVehicle", icon: "/remove.png", label: "Delete Vehicle", isDanger: true }
          ].map(({ href, icon, label, isDanger }) => (
            <li key={href}>
              <Link 
                href={href} 
                onClick={onClose} 
                className={`flex items-center gap-4 text-lg font-medium transition-all px-4 py-2 rounded-lg
                  ${isDanger ? "text-red-400 hover:text-red-500" : "text-gray-200 hover:text-white hover:bg-white/10"}
                `}
              >
                <Image src={icon} alt={label} width={28} height={28} />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SettingsOverlayTwo;
