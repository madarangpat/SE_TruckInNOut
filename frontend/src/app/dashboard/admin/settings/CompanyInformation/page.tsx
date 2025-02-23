"use client";

import Link from "next/link";

const CompanyInformation = () => {
  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      {/* Title */}
      <h1 className="text-3xl font-bold">📁 Company Information</h1>

      {/* Breadcrumb Navigation */}
      <p className="mt-2 text-gray-400">
        <Link href="/dashboard/admin/settings" className="hover:underline">
          Settings
        </Link>{" "}
        / Company Information
      </p>

      {/* Content Section */}
      <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
        <p>Here you can update your company details, address, and contact information.</p>
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <Link href="/dashboard/admin/settings?openSettings=true">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            ← Back to Settings
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CompanyInformation;
