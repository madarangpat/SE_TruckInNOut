"use client"; // This makes the component run on the client side

import React from "react";

const PDFButton: React.FC = () => {
  const handleDownload = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/generate-pdf/", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "generated.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      Download Payroll PDF
    </button>
  );
};

export default PDFButton;
