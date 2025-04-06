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
        console.log("📡 Got location:", latitude, longitude);

        try {
            const res = await axios.post("http://localhost:8000/api/employees/update-location/", {
              employee_id: employeeId,
              latitude,
              longitude,
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