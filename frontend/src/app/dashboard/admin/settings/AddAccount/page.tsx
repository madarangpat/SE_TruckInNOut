"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import SettingsOverlayTwo from "@/components/SettingsOverlayTwo";
import axios from "axios";

const AddAccountPage = () => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    cellphone_no: "",
    philhealth_no: "",
    pag_ibig_no: "",
    sss_no: "",
    license_no: "",
    role: "",
    employee_type: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (searchParams.get("openSettings") === "true") {
      setShowSettings(true);
    }
  }, [searchParams]);

  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setProfilePicture(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const data = new FormData();

      // Append form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      // Append image if selected
      const fileInput = document.getElementById(
        "profile-upload"
      ) as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        data.append("profile_image", fileInput.files[0]);
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API Response:", response);
      setSuccess("Account successfully created!");
      setFormData({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        firstName: "",
        lastName: "",
        cellphone_no: "",
        philhealth_no: "",
        pag_ibig_no: "",
        sss_no: "",
        license_no: "",
        role: "",
        employee_type: "",
      });
      setProfilePicture(null);
      fileInput.value = "";

      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (error: any) {
      console.error("API Error:", error.response?.data);
      setError(error.response?.data?.error || "Failed to create account.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 md:px-8">
      <div className="wrapper w-full max-w-4xl mx-auto p-6 rounded-2xl bg-black/20 shadow-lg">
        <div className="flex justify-between items-end mx-3 gap-2">
          <h2 className="uppercase text-xl sm:text-3xl md:text-4xl font-bold text-black/70">
            Add Account
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
          Add another member to the Big C Family!
        </p>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        {/* ✅ Profile Picture Upload */}
        <div className="flex justify-center mt-4">
          <label htmlFor="profile-upload" className="cursor-pointer relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white/20 hover:bg-black/10 rounded-full flex items-center justify-center border-4 border-white/10 relative overflow-hidden">
              {profilePicture ? (
                <Image
                  src={profilePicture}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="rounded-full object-cover"
                />
              ) : (
                <>
                  <Image
                    src="/accounts.png"
                    alt="Default Icon"
                    width={120}
                    height={120}
                    className="absolute opacity-100 blur-[3px]"
                  />
                  <span className="text-xs sm:text-sm text-center text-black relative">
                    Click to Add Profile Picture
                  </span>
                </>
              )}
            </div>
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePictureChange}
          />
        </div>

        {/* ✅ Account Information Form */}
        <form
          onSubmit={handleSubmit}
          className="custom-form mt-6 w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 text-black"
        >
          {/* Clustered group with header */}
          <div className="col-span-2">
            <h3 className="text-lg font-bold mb-2">User Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="username"
                placeholder="Username*"
                className="input-field"
                value={formData.username}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email*"
                className="input-field"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password*"
                className="input-field pr-12"
                value={formData.password}
                onChange={handleChange}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password*"
                className="input-field"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            {/* 👁 Single toggle under both password fields */}
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-gray-600 underline hover:text-gray-800"
              >
                {showPassword ? "Hide Passwords" : "Show Passwords"}
              </button>
            </div>
          </div>

          {/* Other fields remain as individual grid items */}
          <div className="col-span-2">
            <h3 className="text-lg font-bold mb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name*"
                className="input-field"
                value={formData.firstName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name*"
                className="input-field"
                value={formData.lastName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="cellphone_no"
                placeholder="Cellphone Number*"
                className="input-field"
                value={formData.cellphone_no}
                onChange={handleChange}
              />
              <input
                type="text"
                name="philhealth_no"
                placeholder="Philhealth Number*"
                className="input-field"
                value={formData.philhealth_no}
                onChange={handleChange}
              />
              <input
                type="text"
                name="pag_ibig_no"
                placeholder="Pag-IBIG Number*"
                className="input-field"
                value={formData.pag_ibig_no}
                onChange={handleChange}
              />
              <input
                type="text"
                name="sss_no"
                placeholder="Social Security Number (SSS)*"
                className="input-field"
                value={formData.sss_no}
                onChange={handleChange}
              />
              <input
                type="text"
                name="license_no"
                placeholder="License No.*"
                className="input-field"
                value={formData.license_no}
                onChange={handleChange}
              />
              <select
                name="role"
                className="input-field text-gray-700"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select Role*</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
              </select>
              <select
                name="employee_type"
                className="input-field text-gray-700"
                value={formData.employee_type}
                onChange={handleChange}
                required
              >
                <option value="">Select Employee Type*</option>
                <option value="Driver">Driver</option>
                <option value="Helper">Helper</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
          </div>

          {/* Submit button spanning both columns */}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-[#668743] text-white py-3 rounded-lg text-lg font-semibold hover:bg-[#345216]"
            >
              Create New Account
            </button>
          </div>

          {/* Back Button */}
          <div className="mt-6">
            <button
              onClick={() => setShowSettings(true)}
              className="px-4 py-2 text-black/80 border border-black/40 rounded-lg hover:bg-gray-200 transition"
            >
              ← Back to Settings
            </button>
          </div>
        </form>

        {/* ✅ Back to Settings Button */}
      </div>

      {/* Display Overlay if showSettings is true */}
      {showSettings && (
        <SettingsOverlayTwo onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

export default AddAccountPage;
