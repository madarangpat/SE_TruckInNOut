"use client";

import { useEffect } from "react";
import axios from "axios";

interface Props {
  employeeId: number;
}

const TrackEmployeeLocation = ({ employeeId }: Props) => {
  useEffect(() => {
    console.log("🛰️ TrackEmployeeLocation mounted for employee ID:", employeeId);

    if (typeof window === "undefined") {
      console.log("🚫 Not running in the browser.");
      return;
    }

    if (!navigator.geolocation) {
      console.warn("❌ Geolocation is not supported by this browser.");
      return;
    }

    console.log("📍 Geolocation is supported. Requesting current position...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Get the current time in UTC
        const utcTime = new Date();

        // Adjust to Philippine Time (UTC + 8 hours)
        const phtOffset = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
        const phtTime = new Date(utcTime.getTime() + phtOffset); // Adjust UTC time to PHT

        // Format to ISO string
        const timestamp = phtTime.toISOString(); // Convert to ISO format for consistency

        console.log("📡 Got location:", latitude, longitude, "at", timestamp);

        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/employees/update-location/`, {
            employee_id: employeeId,
            latitude,
            longitude,
            timestamp, // Include the PHT timestamp in the request
          });
          console.log("✅ Location sent successfully:", res.data);
        } catch (err) {
          console.error("❌ Failed to send location to server", err);
        }
      },
      (error) => {
        console.error("🚫 Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [employeeId]);

  return null;
};

export default TrackEmployeeLocation;
