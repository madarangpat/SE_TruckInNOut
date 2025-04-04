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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "role" && ["admin", "super_admin"].includes(value) && { employee_type: "" }),
    }));
  };

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const { password, confirmPassword, role, employee_type } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "\u274C Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (role === "admin" && employee_type) {
      setError("Admin accounts should not have an employee type selected.");
      return;
    }

    if (role === "employee" && !employee_type) {
      setError("Employee role requires an employee type to be selected.");
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      const fileInput = document.getElementById("profile-upload") as HTMLInputElement;
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

      setSuccess("\u2705 Account successfully created!");
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
      const rawError = error.response?.data?.error || "Failed to create account.";
let friendlyMessage = rawError;

if (rawError.includes("UNIQUE constraint failed: api_user.username")) {
  friendlyMessage = "This username is already taken. Please choose another.";
} else if (rawError.includes("UNIQUE constraint failed: api_user.email")) {
  friendlyMessage = "An account with this email already exists.";
} else if (rawError.includes("UNIQUE constraint failed: api_user.cellphone_no")) {
  friendlyMessage = "This cellphone number is already in use.";
} else if (rawError.includes("UNIQUE constraint failed: api_user.philhealth_no")) {
  friendlyMessage = "This PhilHealth number already exists.";
} else if (rawError.includes("UNIQUE constraint failed: api_user.pag_ibig_no")) {
  friendlyMessage = "This Pag-IBIG number already exists.";
} else if (rawError.includes("UNIQUE constraint failed: api_user.sss_no")) {
  friendlyMessage = "This SSS number already exists.";
} else if (rawError.includes("UNIQUE constraint failed: api_user.license_no")) {
  friendlyMessage = "A user with this License Number already exists. Please use a different one.";
}

setError(friendlyMessage);
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

        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        {success && <p className="text-green-500 mt-2 text-sm">{success}</p>}

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

        <form
          onSubmit={handleSubmit}
          className="custom-form mt-6 w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 text-black"
        >
          {[
            { id: "username", label: "Username", type: "text" },
            { id: "email", label: "Email", type: "email" },
            { id: "password", label: "Password", type: showPassword ? "text" : "password" },
            { id: "confirmPassword", label: "Confirm Password", type: showPassword ? "text" : "password" },
            { id: "firstName", label: "First Name" },
            { id: "lastName", label: "Last Name" },
            { id: "cellphone_no", label: "Cellphone Number" },
            { id: "philhealth_no", label: "PhilHealth Number" },
            { id: "pag_ibig_no", label: "Pag-IBIG Number" },
            { id: "sss_no", label: "SSS Number" },
            { id: "license_no", label: "License Number" },
          ].map(({ id, label, type = "text" }) => (
            <div key={id} className="flex flex-col">
              <label htmlFor={id} className="text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                id={id}
                name={id}
                type={type}
                className="input-field"
                placeholder={`Enter ${label}`}
                value={formData[id as keyof typeof formData]}
                onChange={handleChange}
              />
              {id === "password" && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="mt-1 text-xs text-gray-600 underline hover:text-gray-800 text-left"
                >
                  {showPassword ? "Hide Passwords" : "Show Passwords"}
                </button>
              )}
            </div>
          ))}

          <div className="flex flex-col">
            <label htmlFor="role" className="text-sm font-medium text-gray-700">Role</label>
            <select
              id="role"
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
          </div>

          <div className="flex flex-col">
            <label htmlFor="employee_type" className="text-sm font-medium text-gray-700">Employee Type</label>
            <select
              id="employee_type"
              name="employee_type"
              className="input-field text-gray-700"
              value={formData.employee_type}
              onChange={handleChange}
              required={formData.role === "employee"}
            >
              <option value="">
                {(formData.role === "admin" || formData.role === "super_admin")
                  ? "Leave blank for Admin/Super Admin"
                  : "Select Employee Type*"}
              </option>
              <option value="Driver">Driver</option>
              <option value="Helper">Helper</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-[#668743] text-white py-3 rounded-lg text-lg font-semibold hover:bg-[#345216]"
            >
              Create New Account
            </button>
          </div>

          <div className="mt-6 col-span-2">
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

export default AddAccountPage;
