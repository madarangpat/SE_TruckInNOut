"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import axios from "axios";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
});

interface Trip {
  trip_id: number;
  clients: string[][];
  dest_lat: string[][] | string[];
  dest_lng: string[][] | string[];
  completed: boolean[][];
  user_latitude: string;
  user_longitude: string;
  distance_traveled: string;
  street_number: string;
  street_name: string;
  barangay: string;
  city: string;
  province: string;
  region: string;
  country: string;
  vehicle: {
    plate_number: string;
  };
  employee: {
    employee_id: number;
    user: {
      username: string;
      profile_image: string | null;
    };
  };
}

const MapsPage = () => {
  const searchParams = useSearchParams();
  const employeeId = searchParams.get("employee");
  const router = useRouter();

  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/trips/");
        const filtered = res.data.find(
          (t: Trip) => t.employee?.employee_id === Number(employeeId)
        );
        setTrip(filtered || null);

        if (filtered) {
          console.log("📦 Trip keys:", Object.keys(filtered));
        } else {
          console.warn("⚠️ No trip found matching employee ID");
        }

        console.log("🚚 Trip from API:", filtered);
      } catch (err) {
        console.error("Error fetching trip data:", err);
      }
    };

    if (employeeId) {
      fetchTrip();
    }
  }, [employeeId]);

  const getDestination = () => {
    if (!trip) return "";
    const parts = [
      trip.street_number,
      trip.street_name,
      trip.barangay,
      trip.city,
      trip.province,
      trip.region,
      trip.country,
    ];
    return parts.filter(Boolean).join(", ");
  };

  const locations = useMemo(() => {
    if (!trip?.dest_lat || !trip?.dest_lng) {
      console.warn("⚠️ Destination lat/lng not found in trip object.");
      return [];
    }

    try {
      console.log("📍 Raw latitude string:", trip.dest_lat);
      console.log("📍 Raw longitude string:", trip.dest_lng);

      const rawLat = trip.dest_lat;
const rawLng = trip.dest_lng;

const latArray = (Array.isArray(rawLat[0]) ? rawLat[0] : rawLat) as string[];
const lngArray = (Array.isArray(rawLng[0]) ? rawLng[0] : rawLng) as string[];

const validLocations = latArray
  .map((lat, idx) => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lngArray[idx]);
    const completed =
      Array.isArray(trip.completed?.[0])
        ? trip.completed[0][idx]
        : trip.completed?.[idx] ?? false;

    if (!isNaN(latNum) && !isNaN(lngNum)) {
      return {
        lat: latNum,
        lng: lngNum,
        label: `Client: ${trip.clients?.[idx] ?? `Destination ${idx + 1}`}`,
        completed: completed,
      };
    }
    return null;
  })
  .filter(Boolean) as { lat: number; lng: number; label: string; completed: boolean }[];

      console.log("✅ Final locations:", validLocations);
      return validLocations;
    } catch (error) {
      console.error("❌ Failed to parse coordinates:", error);
      return [];
    }
  }, [trip]);

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 md:px-8">
      <div className="wrapper w-full max-w-5xl mx-auto p-6 rounded-2xl bg-black/40 shadow-lg">
        <div className="flex justify-start mb-4">
          <button
            onClick={() => router.push("/dashboard/admin/viewdeliveries")}
            className="bg-[#668743] text-white px-4 py-2 rounded-lg hover:bg-[#345216] transition-all shadow-md"
          >
            ← Back to View Deliveries
          </button>
        </div>

        <div className="flex justify-center items-center mx-3 gap-2">
          <h2 className="capitalize text-2xl font-semibold flex items-center gap-2 mb-4 text-black/40">
            <Image
              src="/truck.png"
              alt="Truck"
              width={40}
              height={40}
              className="opacity-40"
            />
            Trips in Progress
          </h2>
        </div>

        {trip ? (
          <div className="wrapper p-4 rounded-lg border-2 border-white text-white">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-black/25 rounded-full flex items-center justify-center border-2 border-white overflow-hidden">
                <Image
                  src={trip.employee?.user.profile_image || "/accountsblk.png"}
                  alt="Employee"
                  width={70}
                  height={70}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="w-full text-center md:text-left">
                <p className="text-black/55 font-medium">
                  Employee: {trip.employee?.user.username} (
                  {trip.vehicle?.plate_number || "No Plate"})
                </p>
                <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
                  <strong>NUMBER OF CLIENTS:</strong>{" "}
                  {trip.clients?.[0]?.length || "__________"}
                </p>
                <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
                  <strong>DESTINATION:</strong> {getDestination()} (redacted km`)
                </p>
                <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
                  <strong>LOCATION:</strong> {trip.user_latitude},{" "}
                  {trip.user_longitude}
                </p>
              </div>
            </div>

            <div className="w-full h-96 bg-gray-700 rounded-lg mt-7">
              {locations.length > 0 ? (
                <LeafletMap
                  locations={locations}
                  userLat={14.65889} // or parseFloat(trip.user_latitude)
                  userLng={121.10419} // or parseFloat(trip.user_longitude)
                  isAdmin={true}
                />
              ) : (
                <p className="text-red-400 p-4">
                  ⚠️ No valid destination coordinates found.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-white text-center">
            Trip not found for this employee.
          </p>
        )}
      </div>
    </div>
  );
};

export default MapsPage;
