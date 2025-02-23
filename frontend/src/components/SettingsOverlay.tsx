"use client";

import { IoClose } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";

const SettingsOverlay = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">

      {/* Overlay Content (Fully Centered) */}
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-[450px] max-w-full relative text-center border border-white/20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold tracking-wide text-gray-300 uppercase">SETTINGS</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white transition">
            <IoClose size={24} />
          </button>
        </div>

        {/* Settings Options - Now with Icons & Proper Spacing */}
        <ul className="space-y-5 text-gray-300">
          <li className="hover:text-white cursor-pointer flex items-center gap-4 text-lg font-medium transition">
            <Image src="/info.png" alt="Company Info" width={32} height={32} />
            <Link href="/dashboard/admin/settings/CompanyInformation" onClick={onClose}>
              Company Information
            </Link>
          </li>
          <li className="hover:text-white cursor-pointer flex items-center gap-4 text-lg font-medium transition">
            <Image src="/usergroups.png" alt="Employee Data" width={32} height={32} />
            <Link href="/dashboard/admin/settings/EmployeeData" onClick={onClose}>
              Employee Data
            </Link>
          </li>
          <li className="hover:text-white cursor-pointer flex items-center gap-4 text-lg font-medium transition">
            <Image src="/payroll.png" alt="Salary Config" width={32} height={32} />
            <Link href="/dashboard/admin/settings/SalaryConfiguration" onClick={onClose}>
              Salary Configuration
            </Link>
          </li>
          <li className="hover:text-white cursor-pointer flex items-center gap-4 text-lg font-medium transition">
            <Image src="/plustrip2.png" alt="Add Account" width={32} height={32} />
            <Link href="/dashboard/admin/settings/AddAccount" onClick={onClose}>
              Add Account
            </Link>
          </li>
          <li className="hover:text-red-400 cursor-pointer flex items-center gap-4 text-lg font-medium transition">
            <Image src="/remove.png" alt="Delete Account" width={32} height={32} />
            <Link href="/dashboard/admin/settings/DeleteAccount" onClick={onClose}>
              Delete Account
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SettingsOverlay;
