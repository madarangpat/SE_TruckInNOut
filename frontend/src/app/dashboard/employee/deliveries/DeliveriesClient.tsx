"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { updateCompletedStatus } from "@/lib/actions/deliveries.actions";

type DeliveriesClientProps = {
  recentTrips: Trip[];
  ongoingTrips: Trip[];
  employeename: {
    employee_id: number;
    completed_trip_count?: number;
    payment_status?: string;
    name?: string;
    user: {
      id: number;
      username: string;
      profile_image: string | null;
      role: string;
    };
  } | null;
}

type Trip = {
  trip_id: number;
  num_of_drops: number;
  start_date: string;
  end_date?: string;
  trip_status: string;
  base_salary: string;
  driver_base_salary: number;
  helper_base_salary: number;
  addresses: string[];
  clients: string[];
  completed: boolean[];
  helper?: { username: string } | null;
  helper2?: { username: string } | null;
  vehicle: {
    plate_number: string;
    vehicle_type: string;
    is_company_owned: boolean;
    subcon_name: string | null;
  };
  employee?: {
    employee_id: number;
    user: {
      username: string;
      profile_image: string | null;
    };
    employee_type?: string;
  } | null;
};

const DeliveriesClient = ({ employeename,
  
  recentTrips,
  ongoingTrips: initialOngoingTrips,
}: DeliveriesClientProps) => {
  const [ongoingTrips, setOngoingTrips] = useState<Trip[]>(initialOngoingTrips);
  const employee = ongoingTrips.length > 0 ? ongoingTrips[0]?.employee : null;
 // Assuming all trips have the same employee

 

  const filteredOngoing = (ongoingTrips ?? []).filter(
    (trip) => trip.trip_status === "Ongoing" || trip.trip_status === "Ongoing"
  );
  
  const filteredRecent = (recentTrips ?? []).filter(
    (trip) => trip.trip_status === "Confirmed" || trip.trip_status === "true"
  );  

  const handleDropToggle = async (tripId: number, dropIndex: number) => {
    const trip = ongoingTrips.find((t) => t.trip_id === tripId);
    if (!trip) return;

    const updatedCompleted = [...trip.completed];
    updatedCompleted[dropIndex] = !updatedCompleted[dropIndex];

    try {
      await updateCompletedStatus(tripId, updatedCompleted);
      toast.success("Drop status updated!");

      setOngoingTrips((prevTrips) =>
        prevTrips.map((t) =>
          t.trip_id === tripId ? { ...t, completed: updatedCompleted } : t
        )
      );
    } catch (err) {
      console.error("❌ Sync error:", err);
      toast.error("Failed to update drop status.");
    }
  };

  return (
    <div className="min-h-fit flex flex-col items-center justify-center px-4 sm:px-6 lg:px-10 pt-4">
      {/* Welcome Section with Profile and Logo */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
            <Image
              src={employeename?.user.profile_image || "/accounts.png"}
              alt="Profile"
              width={70}
              height={70}
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-lg text-black/60">Welcome back,</p>
            <h1 className="text-2xl font-semibold text-black/80">
              {employeename?.user.username || "Loading..."}
            </h1>
          </div>
        </div>
        <Image
          src="/bigc.png"
          alt="Big C Logo"
          width={100}
          height={50}
          className="object-contain -mt-4" // Adjusted margin-top to move logo up
        />
      </div>

      {/* Ongoing Trips */}
      <div className="wrapper w-full max-w-5xl rounded-2xl shadow-lg p-6 my-8 bg-black/40">
        <h2 className="text-center text-2xl font-semibold text-black/40 mb-4 flex justify-center items-center gap-2">
          <Image
            src="/truck.png"
            alt="Ongoing Trips"
            width={30}
            height={30}
            className="opacity-40"
          />
          Ongoing Trips
        </h2>

        <div className="innerwrapper max-h-[250px] overflow-y-auto flex flex-col gap-4">
          {filteredOngoing.length > 0 ? (
            filteredOngoing.map((trip) => {
              const driverName = trip.employee?.user.username || "None";
              const helperUsernames = [
                trip.helper?.username,
                trip.helper2?.username,
              ].filter(Boolean);
              const helpers =
                helperUsernames.length > 0
                  ? helperUsernames.join(", ")
                  : "None";

              return (
                <div
                  key={trip.trip_id}
                  className="wrappersmall2 flex flex-col sm:flex-row items-center justify-between p-4 bg-[#668743] text-white rounded-lg shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left w-full">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center border border-white overflow-hidden">
                      <Image
                        src={
                          trip.employee?.user.profile_image || "/accounts.png"
                        }
                        alt="Profile"
                        width={70}
                        height={70}
                        className="rounded-full object-cover opacity-90"
                      />
                    </div>

                    <div className="w-full">
                      <p className="font-medium">
                        {driverName} ({trip.vehicle.plate_number} |{" "}
                        {trip.vehicle.vehicle_type} |{" "}
                        {trip.vehicle.is_company_owned
                          ? "Company Owned"
                          : `Private (${trip.vehicle.subcon_name || "N/A"})`}
                        )
                      </p>

                      {(trip.helper || trip.helper2) && (
                        <p className="text-sm italic text-white/80 mt-1">
                          <strong>Helpers:</strong> {helpers}
                        </p>
                      )}

                      <p className="text-sm bg-white/20 text-white px-3 py-1 rounded-md mt-1 w-full">
                        <strong>Total Drops:</strong>{" "}
                        {trip.num_of_drops || "__________"}
                      </p>

                      <p className="text-sm bg-white/20 text-white px-3 py-1 rounded-md mt-1 w-full">
                        <strong>Final Drop:</strong>{" "}
                        {trip.addresses?.length > 0
                          ? trip.addresses[trip.addresses.length - 1]
                              ?.split(",")
                              .slice(0, 2)
                              .map((part) => part.trim())
                              .join(", ")
                          : "N/A"}
                      </p>

                      <p className="text-sm bg-white/20 text-white px-3 py-1 rounded-md mt-1 w-full">
                        <strong>Your Salary:</strong> {trip.driver_base_salary || "___"}
                      </p>

                      <p className="text-sm bg-white/20 text-white px-3 py-1 rounded-md mt-1 w-full">
                        <strong>Helper Salary:</strong> {trip.helper_base_salary || "___"}
                      </p>
           
                      {/* Drop Toggles */}
                      {trip.addresses.map((address, index) => (
                        <label
                          key={index}
                          className="flex items-center gap-2 text-xs text-white/90 mt-1"
                        >
                          <input
                            type="checkbox"
                            checked={trip.completed?.[index] || false}
                            onChange={() =>
                              handleDropToggle(trip.trip_id, index)
                            }
                            className="form-checkbox h-4 w-4 text-green-500"
                          />
                          {address
                            .split(",")
                            .slice(0, 2)
                            .map((part) => part.trim())
                            .join(", ")}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-white text-center text-lg">No Current Trip/s.</p>
          )}
        </div>
      </div>

      {/* Recent Trips */}
      <div className="wrapper w-full max-w-5xl rounded-2xl shadow-lg p-6 bg-black/20">
        <h2 className="text-center text-2xl font-semibold text-black/50 mb-4 flex justify-center items-center gap-2">
          <Image
            src="/package.png"
            alt="Recent Trips"
            width={30}
            height={30}
            className="opacity-50"
          />
          Recent Trips
        </h2>

        <div className="innerwrapper max-h-[250px] overflow-y-auto flex flex-col gap-4">
          {filteredRecent.length > 0 ? (
            filteredRecent.map((trip) => {
              const driverName = trip.employee?.user.username || "None";
              const helperUsernames = [
                trip.helper?.username,
                trip.helper2?.username,
              ].filter(Boolean);
              const helpers =
                helperUsernames.length > 0
                  ? helperUsernames.join(", ")
                  : "None";

              return (
                <div
                  key={trip.trip_id}
                  className="wrappersmall2 flex flex-col sm:flex-row items-center justify-between p-4 bg-[#d9e0cc] text-black/80 rounded-lg shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left w-full">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center border border-gray-500 overflow-hidden">
                      <Image
                        src={
                          trip.employee?.user.profile_image ||
                          "/accountsblk.png"
                        }
                        alt="Profile"
                        width={70}
                        height={70}
                        className="rounded-full object-cover opacity-90"
                      />
                    </div>

                    <div className="w-full">
                      <p className="font-medium">
                        {driverName} ({trip.vehicle.plate_number} |{" "}
                        {trip.vehicle.vehicle_type} |{" "}
                        {trip.vehicle.is_company_owned
                          ? "Company Owned"
                          : `Private (${trip.vehicle.subcon_name || "N/A"})`}
                        )
                      </p>

                      <p className="text-sm italic text-black/70 mt-1">
                        <strong>Helpers:</strong> {helpers}
                      </p>

                      <p className="text-sm bg-white/50 text-black px-3 py-1 rounded-md mt-1 w-full">
                        <strong>Total Drops:</strong>{" "}
                        {trip.num_of_drops || "__________"}
                      </p>

                      <p className="text-sm bg-white/50 text-black px-3 py-1 rounded-md mt-1 w-full">
                        <strong>Final Drop:</strong>{" "}
                        {trip.addresses?.length > 0 && trip.clients?.length > 0
                          ? `${trip.addresses[trip.addresses.length - 1]
                              ?.split(",")
                              .slice(0, 2)
                              .map((part) => part.trim())
                              .join(", ")} (Client: ${
                              trip.clients[trip.clients.length - 1]
                            })`
                          : "No address available"}
                      </p>

                      <p className="text-sm bg-white/50 text-black px-3 py-1 rounded-md mt-1 w-full">
                        <strong>Your Salary:</strong>{" "}
                        ₱{" "}
                        {Number(trip.driver_base_salary ?? 0).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>

                      <p className="text-sm bg-white/50 text-black px-3 py-1 rounded-md mt-1 w-full">
                        <strong>Helper Salary:</strong>{" "}
                        ₱{" "}
                        {Number(trip.helper_base_salary ?? 0).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p> 
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-white text-center text-lg">No Trips Recently.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveriesClient;