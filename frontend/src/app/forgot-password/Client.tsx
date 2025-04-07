"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { sendResetPasswordLink } from "@/auth/auth.actions";

const ForgotPasswordClient: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleForgotPassword = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;

      await sendResetPasswordLink(email);
      setMessage("<strong>We've sent a password reset link to your email. Please check your inbox and click it to reset your password.</strong>");
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
      <div className="wrapper w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col items-center relative">
        <div className="flex justify-end items-center gap-2 w-full sm:absolute sm:top-6 sm:right-6">
          <Image
            src="/tinoicon.png"
            alt="Truck"
            width={25}
            height={25}
            className="opacity-100 sm:w-10 h-auto"
          />
          <span className="text-xs sm:text-sm font-semibold text-black">
            TruckIn-N-Out
          </span>
        </div>

        <div className="flex justify-center mb-4 sm:mb-6 mt-4 sm:mt-6">
          <Image
            src="/lock.png"
            alt="Lock Icon"
            width={140}
            height={140}
            className="opacity-90 sm:w-28 sm:h-28"
          />
        </div>

        <h2 className="text-sm sm:text-lg font-semibold text-black text-center mb-1">
          Forgot your password?
        </h2>
        <p className="text-xs sm:text-sm text-black/90 text-center mb-5">
          Enter your email so we can work on it!
        </p>

        <form onSubmit={handleForgotPassword} className="w-full">
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your Email"
            className="input-field w-full mb-4 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 text-black text-xs sm:text-sm"
          />

          {message && (
            <p 
              className="text-black/80 text-xs sm:text-sm"
              dangerouslySetInnerHTML={{__html: message}}
            />
          )}
          {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}

          <div className="flex flex-col gap-1 justify-center w-full py-2">
            <button
              type="submit"
              className="w-4/5 sm:w-3/4 bg-[#668743] text-white rounded-lg text-xs sm:text-lg font-semibold hover:bg-[#345216]"
            >
              Send Verification
            </button>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-4/5 sm:w-3/4 bg-[#668743] text-white rounded-lg text-xs sm:text-lg font-semibold hover:bg-[#345216]"
            >
              Return to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordClient;
