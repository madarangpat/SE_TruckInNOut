"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SettingsOverlay from "@/components/SettingsOverlay";

const DeleteAccount = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);

  // Automatically show the overlay if `openSettings=true` is in the URL
  useEffect(() => {
    if (searchParams.get("openSettings") === "true") {
      setShowSettings(true);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 md:px-8">
      <div className="wrapper w-full max-w-3xl mx-auto p-6 rounded-2xl bg-gray-900 shadow-lg">
        <h1 className="text-3xl font-bold text-red-400">🗑 Delete Account</h1>
        <p className="mt-2 text-gray-400">
          Deleting an account is <strong>permanent</strong> and cannot be undone.
        </p>

        {/* Warning Message */}
        <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
          <p className="text-red-300">
            ⚠ Warning: This action is irreversible. Proceed with caution.
          </p>
        </div>

        {/* Back to Settings Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/dashboard/admin/settings?openSettings=true")}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            ← Back to Settings
          </button>
        </div>
      </div>

      {/* ✅ Settings Overlay - Now Works the Same as Other Pages */}
      {showSettings && (
        <SettingsOverlay
          onClose={() => {
            setShowSettings(false);
            router.push("/dashboard/admin/settings/DeleteAccount", { scroll: false }); // Remove query parameter after closing
          }}
        />
      )}
    </div>
  );
};

export default DeleteAccount;
