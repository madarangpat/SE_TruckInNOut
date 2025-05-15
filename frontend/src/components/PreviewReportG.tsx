"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Props {
  start: string;
  end: string;
  onClose: () => void;
}

const PreviewReportG: React.FC<Props> = ({ start, end, onClose }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const params = new URLSearchParams({
          start_date: start,
          end_date: end,
        });

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN}/generate-pdf/gross-preview/?${params}`
        );

        if (!response.ok) throw new Error("Failed to fetch gross payroll PDF preview");

        // Fetch the PDF as a Blob
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url); // Create an object URL for the Blob and set it as the src for the iframe
      } catch (err) {
        console.error("Gross PDF Preview Error:", err);
        setPdfUrl(null);
      } finally {
        setLoading(false);
      }
    };

    if ( start && end) {
      fetchPDF();
    }
  }, [start, end]);

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
            <iframe src={pdfUrl} title="Gross Payroll Preview" className="w-full h-full" />
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

export default PreviewReportG;
