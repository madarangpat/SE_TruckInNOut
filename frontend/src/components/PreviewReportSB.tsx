"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { SessionStore } from "@/auth/session";

interface Props {
  employee: string;
  session: SessionStore;
  start: string;
  end: string;
  onClose: () => void;
}

const PreviewReportSB: React.FC<Props> = ({
  employee,
  session,
  start,
  end,
  onClose,
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        // Ensure start and end are valid
        if (!employee || !start || !end) {
          console.error("Missing required parameters");
          return; // Exit if required parameters are missing
        }

        const startDateOnly = start.split("T")[0]; // Format the start date
        const endDateOnly = end ? end.split("T")[0] : ""; // Ensure end is valid, fallback to "" if not

        // If endDate is empty, we may want to either skip it or set a default
        if (!endDateOnly) {
          console.error("End date is missing or invalid");
          return; // Exit if end date is invalid
        }

        // Create query parameters
        const params = new URLSearchParams({
          employee,
          start_date: startDateOnly,
          end_date: endDateOnly, // Only include if valid
        });

        const url = `${process.env.NEXT_PUBLIC_DOMAIN}/generate-pdf/salary-breakdown/?${params}`;
        console.log(url); // Log the final URL to check its structure

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch PDF preview");

        const blob = await response.blob();
        const urlBlob = URL.createObjectURL(blob);
        setPdfUrl(urlBlob);
      } catch (err) {
        console.error("PDF Preview Error:", err);
        setPdfUrl(null);
      } finally {
        setLoading(false);
      }
    };

    if (employee && start && end) {
      fetchPDF();
    }
  }, [employee, start, end, session.access]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#668743] w-full max-w-4xl h-[90vh] overflow-hidden rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 left-4 text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg z-10"
        >
          <Image src="/Back.png" alt="Close" width={24} height={24} />
        </button>

        <div className="h-full w-full pt-12">
          {loading ? (
            <div className="text-center mt-20 text-lg">
              Loading PDF preview...
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              title="Salary Breakdown Preview"
              className="w-full h-full"
            />
          ) : (
            <div className="text-center mt-20 text-white">
              <p>No completed trips found for the selected date range.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewReportSB;
