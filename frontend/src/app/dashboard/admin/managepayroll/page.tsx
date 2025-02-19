import React from "react";
import PDFButton from "@/components/PDFButton"; // Ensure correct import path

const ManagePayroll: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Payroll</h1>
      <PDFButton />
    </div>
  );
};

export default ManagePayroll;
