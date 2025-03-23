"use client";

import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const router = useRouter();

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full text-center border rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <h2 className="text-red-500 flex items-center justify-center gap-2 text-xl font-semibold">
            <AlertCircle className="w-6 h-6" /> {error.message}
          </h2>
        </div>
        <div className="px-4 py-2">
          <p className="text-gray-700">
            Your password reset link is invalid or has expired.
          </p>
          <p className="text-gray-700 mt-2">Please request a new one.</p>
          <div className="mt-4 flex flex-col gap-2">
            <button 
              onClick={() => router.push("/reset-password")}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
            >
              Request New Link
            </button>
            <button 
              onClick={() => router.push("/")}
              className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 py-2 px-4 rounded-md font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}