"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Props {
  employee: string;
  start: string;
  end: string;
  onClose: () => void;
}

const PreviewReportSB: React.FC<Props> = ({ employee, start, end, onClose }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const params = new URLSearchParams({
          employee,
          start_date: start.split("T")[0],
          end_date: end.split("T")[0],
        });

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN}/generate-pdf/salary-breakdown/?${params}`,
          { method: "GET" }
        );

        if (!response.ok) throw new Error("Failed to fetch PDF preview");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
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
  }, [employee, start, end]);

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
            <div className="text-center mt-20 text-lg">Loading PDF preview...</div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              title="Salary Breakdown Preview"
              className="w-full h-full"
            />
          ) : (
            <div className="text-center mt-20 text-red-500">
              Failed to load PDF preview.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewReportSB;
