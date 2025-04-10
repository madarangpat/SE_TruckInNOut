"use client";

import { useEffect } from "react";
import axios from "axios";

interface Props {
  employeeId: number;
}

const TrackEmployeeLocation = ({ employeeId }: Props) => {
  useEffect(() => {
    console.log("🛰️ TrackEmployeeLocation mounted for employee ID:", employeeId);

    // Ensure we're in the browser environment
    if (typeof window === "undefined") {
      console.log("🚫 Not running in the browser.");
      return;
    }

    // Check if geolocation is supported
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

    
        // Format to ISO string for consistency
        const timestamp = utcTime.toISOString(); // Convert to ISO format for consistency

        console.log("📡 Got location:", latitude, longitude, "at", timestamp);

        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/employees/update-location/`, {
            employee_id: employeeId,
            latitude,
            longitude,
            timestamp
          });
        
          // Log the full response
          console.log("Full response from server:", res);
          console.log(timestamp)
          // Log the status and timestamp specifically
          console.log("Response status:", res.status);
          console.log("Response data:", res.data);
        
          // Check for the presence of timestamp
          if (res.data.timestamp) {
            console.log("Timestamp received:", res.data.timestamp);
          } else {
            console.error("❌ Missing timestamp in response:", res);
          }
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
