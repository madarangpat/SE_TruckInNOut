"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/auth/auth.actions";

const Client = ({ token }: { token: string }) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const formData = new FormData(e.currentTarget);
      const newPassword = formData.get("newPassword") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      await resetPassword(newPassword, confirmPassword, token);
      setMessage("Password reset successful!");
      
      // Only redirect after success
      setTimeout(() => {
        router.push("/login");
      }, 2000); // Give user 2 seconds to see success message
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
        setError(error.message);
      } else {
        console.error("An unexpected error occurred.");
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
      <div className="wrapper w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col items-center">
        {/* Header with Logo */}
        <div className="flex justify-end items-center gap-2 w-full sm:absolute sm:top-6 sm:right-6">
          <Image
            src="/tinoicon.png"
            alt="Truck"
            width={25}
            height={25}
            className="opacity-100 sm:w-10 h-auto"
          />
          <a className="text-xs sm:text-sm font-semibold text-black">
            TruckIn-N-Out
          </a>
        </div>

        {/* Lock Icon */}
        <div className="flex justify-center mb-4 sm:mb-6 mt-4 sm:mt-6">
          <Image
            src="/lock.png"
            alt="Lock Icon"
            width={140}
            height={140}
            className="opacity-90 sm:w-28 sm:h-28"
          />
        </div>

        {/* Title */}
        <h2 className="text-sm sm:text-lg font-semibold text-black text-center mb-1">
          Change your password
        </h2>
        <p className="text-xs sm:text-sm text-black/60 text-center mb-5 px-4 sm:px-10">
          Enter your new password below.
        </p>

        {/* Input Fields */}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            name="newPassword"
            className="input-field w-full mb-4 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 text-black text-xs sm:text-sm"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            className="input-field w-full mb-4 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 text-black text-xs sm:text-sm"
          />

          {/* Error & Success Messages */}
          {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}
          {message && (
            <p className="text-green-500 text-xs sm:text-sm">{message}</p>
          )}

          {/* Submit Button */}
          <div className="flex justify-center w-full mt-3">
            <button
              type="submit"
              className="h-10 w-4/5 sm:w-3/4 bg-[#668743] text-white rounded-lg text-xs sm:text-lg font-semibold hover:bg-[#345216]"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Client;
