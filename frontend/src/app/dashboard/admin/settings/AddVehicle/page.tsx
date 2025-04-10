"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import SettingsOverlayTwo from "@/components/SettingsOverlayTwo";
import axios from "axios";
import { toast } from "sonner";

const AddVehiclePage = () => {
  const [formData, setFormData] = useState<{
    plate_number: string;
    vehicle_type: string;
    is_company_owned: boolean;
    subcon_name?: string;
  }>({
    plate_number: "",
    vehicle_type: "Truck",
    is_company_owned: false,
    subcon_name: "",
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

    // ✅ Validate subcon_name manually
    if (!formData.is_company_owned && !formData.subcon_name?.trim()) {
      setError("Subcon name is required when the vehicle is not company owned.");
      return;
    }

    const payload = { ...formData };
    if (formData.is_company_owned) {
      delete payload.subcon_name;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_DOMAIN}/register-vehicle/`,
        payload,
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
        vehicle_type: "Truck",
        is_company_owned: false,
        subcon_name: "",
      });

      setTimeout(() => setSuccess(null), 6000);
    } catch (error: any) {
      if(error.response?.data?.error?.includes("UNIQUE constraint failed")){
        toast.error("The plate number already exists in the system.");
      } else {
        toast.error(error.response?.data?.error || "Failed to register vehicle.");
      }
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

        {/* ✅ FORM */}
        <form
          onSubmit={handleSubmit}
          className="custom-form mt-6 w-full mx-auto grid-cols-1 gap-4 text-black"
        >
          {/* ✅ Company Owned Checkbox */}
          <div>
            <label htmlFor="is_company_owned" className="text-sm font-bold block mb-1">
              Company Owned
            </label>
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

          {/* ✅ Subcon Name (conditionally visible) */}
          {!formData.is_company_owned && (
            <div>
              <label htmlFor="subcon_name" className="text-sm font-bold block mb-1">
                Subcon Name
              </label>
              <input
                type="text"
                id="subcon_name"
                name="subcon_name"
                placeholder="Enter subcontractor name"
                className="input-field"
                value={formData.subcon_name}
                onChange={handleChange}
                required={!formData.is_company_owned}
              />
            </div>
          )}

          {/* ✅ Plate Number */}
          <div>
            <label htmlFor="plate_number" className="text-sm font-bold block mb-1">
              Plate Number
            </label>
            <input
              type="text"
              name="plate_number"
              id="plate_number"
              placeholder="Plate Number (e.g., ABC 1234 or CCC 123)*"
              className="input-field"
              value={formData.plate_number}
              onChange={handleChange}
              pattern="^[A-Z]{3} \d{3,4}$"
              title="Plate Number must follow the format ABC 1234"
              required
            />
          </div>

          {/* ✅ Vehicle Type (select dropdown) */}
          <div>
            <label htmlFor="vehicle_type" className="text-sm font-bold block mb-1">
              Vehicle Type
            </label>
            <select
              name="vehicle_type"
              id="vehicle_type"
              className="input-field"
              value={formData.vehicle_type}
              onChange={handleChange}
              required
            >
              <option value="">Select a vehicle type</option>
              <option value="2 Ton Truck">2 Ton Truck</option>
              <option value="4 Ton Truck">4 Ton Truck</option>
              <option value="6 Ton Truck">6 Ton Truck</option>
            </select>
          </div>

          {/* ✅ Submit Button */}
          <div className="col-span-2 mt-4">
            <button
              type="submit"
              className="w-full bg-[#668743] text-white py-3 rounded-lg text-lg font-semibold hover:bg-[#345216]"
            >
              Create New Vehicle
            </button>
          </div>

          {/* ✅ Back Button */}
          <div className="mt-6">
            <button
              onClick={() => setShowSettings(true)}
              type="button"
              className="px-4 py-2 text-black/80 border border-black/40 rounded-lg hover:bg-gray-200 transition"
            >
              ← Back to Settings
            </button>
          </div>
        </form>
      </div>

      {/* ✅ Settings Overlay */}
      {showSettings && (
        <SettingsOverlayTwo onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

export default AddVehiclePage;
