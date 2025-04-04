"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import SettingsOverlayTwo from "@/components/SettingsOverlayTwo";
import axios from "axios";

const AddVehiclePage = () => {
  const [formData, setFormData] = useState({
    plate_number: "",
    vehicle_type: "Truck", // Always default to "Truck"
    is_company_owned: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (searchParams.get("openSettings") === "true") {
      setShowSettings(true);
    }
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    const newValue =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : name === "plate_number"
        ? value.toUpperCase()
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register-vehicle/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response);
      setSuccess("Vehicle successfully registered!");
      setFormData({
        plate_number: "",
        vehicle_type: "Truck", // Reset back to "Truck"
        is_company_owned: false,
      });

      // Auto-clear success message
      setTimeout(() => setSuccess(null), 6000);
    } catch (error: any) {
      console.error("API Error:", error.response?.data);
      setError(error.response?.data?.error || "Failed to register vehicle.");

      // Auto-clear error message
      setTimeout(() => setError(null), 6000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 md:px-8">
      <div className="wrapper w-full max-w-2xl mx-auto p-6 rounded-2xl bg-black/20 shadow-lg">
        <div className="flex justify-between items-end mx-3 gap-2">
          <h2 className="uppercase text-xl sm:text-3xl md:text-4xl font-bold text-black/70">
            Add Vehicle
          </h2>
          <Image
            src="/tinowlabel2.png"
            alt="Logo"
            width={80}
            height={80}
            className="w-12 sm:w-16 md:w-20 h-auto opacity-100"
          />
        </div>

        <p className="px-3 text-start text-[8px] sm:text-base md:text-lg font-medium text-black/50 mt-1">
          Register a new company or personal vehicle.
        </p>

        {error && (
          <div className="mt-4 w-full bg-red-100 text-red-800 px-4 py-2 rounded-lg text-sm font-medium shadow">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 w-full bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium shadow">
            {success}
          </div>
        )}

        {/* ✅ Vehicle Form */}
        <form
          onSubmit={handleSubmit}
          className="custom-form mt-6 w-full mx-auto grid grid-cols-1 md:grid-cols-1 gap-4 text-black"
        >
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-2">Vehicle Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <input
                type="text"
                name="plate_number"
                placeholder="Plate Number (e.g., AB 1234)*"
                className="input-field"
                value={formData.plate_number}
                onChange={handleChange}
               pattern="^[A-Z]{3} \d{4}$"
                title="Plate Number must follow the format LL DDDD (e.g., AB 1234)"
                required
              />

              {/* Vehicle type shown but disabled, fixed to "Truck" */}
              <input
                type="text"
                name="vehicle_type"
                className="input-field bg-gray-100 cursor-not-allowed"
                value="Truck"
                disabled
              />

              <div className="flex items-center">
                <div className="ml-1">
                  <input
                    type="checkbox"
                    id="is_company_owned"
                    name="is_company_owned"
                    checked={formData.is_company_owned}
                    onChange={handleChange}
                    className="accent-green-600"
                    style={{ width: "20px", height: "20px" }}
                  />
                </div>

                <label
                  htmlFor="is_company_owned"
                  className="text-sm font-medium ml-2"
                >
                  Company Owned
                </label>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-[#668743] text-white py-3 rounded-lg text-lg font-semibold hover:bg-[#345216]"
            >
              Create New Vehicle
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
        </form>
      </div>

      {showSettings && (
        <SettingsOverlayTwo onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

export default AddVehiclePage;