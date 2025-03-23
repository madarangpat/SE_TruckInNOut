"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SettingsOverlayTwo from "@/components/SettingsOverlayTwo";

export default function SettingsPage() {
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
    <div className="relative">
      {/* ✅ Only Show the Settings Overlay */}
      {showSettings && (
        <SettingsOverlayTwo
          onClose={() => {
            setShowSettings(false);
            router.push("/dashboard/admin/settings", { scroll: false }); // Remove query parameter after closing
          }}
        />
      )}
    </div>
  );
}


