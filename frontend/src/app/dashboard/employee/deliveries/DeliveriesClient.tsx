"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import axios from "axios";
import { updateCompletedStatus } from "@/lib/actions/deliveries.actions";

type DeliveriesClientProps = {
  recentTrips: Trip[];
  ongoingTrips: Trip[];
};

type Trip = {
  trip_id: number;
  num_of_drops: number;
  start_date: string;
  end_date?: string;
  is_completed: boolean | string;
  base_salary?: number;
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
  } | null;
};

const DeliveriesClient = ({
  recentTrips,
  ongoingTrips: initialOngoingTrips,
}: DeliveriesClientProps) => {
  const [ongoingTrips, setOngoingTrips] = useState<Trip[]>(initialOngoingTrips);

  const filteredOngoing = (ongoingTrips ?? []).filter(
    (trip) => trip.is_completed === false || trip.is_completed === "false"
  );
  
  const filteredRecent = (recentTrips ?? []).filter(
    (trip) => trip.is_completed === true || trip.is_completed === "true"
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
      {/* Ongoing Trips */}
      <div className="wrapper w-full max-w-5xl rounded-2xl shadow-lg p-6 my-8 bg-black/40">
        <h2 className="text-center text-2xl font-semibold text-black/40 mb-4 flex justify-center items-center gap-2">
          <Image src="/truck.png" alt="Ongoing Trips" width={30} height={30} className="opacity-40" />
          Ongoing Trips
        </h2>

        <div className="innerwrapper max-h-[250px] overflow-y-auto flex flex-col gap-4">
          {filteredOngoing.length > 0 ? (
            filteredOngoing.map((trip) => {
              const driverName = trip.employee?.user.username || "None";
              const helperUsernames = [trip.helper?.username, trip.helper2?.username].filter(Boolean);
              const helpers = helperUsernames.length > 0 ? helperUsernames.join(", ") : "None";

              return (
                <div
                  key={trip.trip_id}
                  className="wrappersmall2 flex flex-col sm:flex-row items-center justify-between p-4 bg-[#668743] text-white rounded-lg shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left w-full">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center border border-white overflow-hidden">
                      <Image
                        src={trip.employee?.user.profile_image || "/accounts.png"}
                        alt="Profile"
                        width={70}
                        height={70}
                        className="rounded-full object-cover opacity-90"
                      />
                    </div>

                    <div className="w-full">
                      <p className="font-medium">
                        {driverName} (
                        {trip.vehicle.plate_number} | {trip.vehicle.vehicle_type} |{" "}
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
                        <strong>Number of Drops:</strong> {trip.num_of_drops || "__________"}
                      </p>

                      <p className="text-sm bg-white/20 text-white px-3 py-1 rounded-md mt-1 w-full">
                        <strong>Salary:</strong> {trip.base_salary || "___"}
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

                      {/* Drop Toggles */}
                      {trip.addresses.map((address, index) => (
                        <label key={index} className="flex items-center gap-2 text-xs text-white/90 mt-1">
                          <input
                            type="checkbox"
                            checked={trip.completed?.[index] || false}
                            onChange={() => handleDropToggle(trip.trip_id, index)}
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
          <Image src="/package.png" alt="Recent Trips" width={30} height={30} className="opacity-50" />
          Recent Trips
        </h2>

        <div className="innerwrapper max-h-[250px] overflow-y-auto flex flex-col gap-4">
          {filteredRecent.length > 0 ? (
            filteredRecent.map((trip) => {
              const driverName = trip.employee?.user.username || "None";
              const helperUsernames = [trip.helper?.username, trip.helper2?.username].filter(Boolean);
              const helpers = helperUsernames.length > 0 ? helperUsernames.join(", ") : "None";

              return (
                <div
                  key={trip.trip_id}
                  className="wrappersmall2 flex flex-col sm:flex-row items-center justify-between p-4 bg-[#d9e0cc] text-black/80 rounded-lg shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left w-full">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center border border-gray-500 overflow-hidden">
                      <Image
                        src={trip.employee?.user.profile_image || "/accountsblk.png"}
                        alt="Profile"
                        width={70}
                        height={70}
                        className="rounded-full object-cover opacity-90"
                      />
                    </div>

                    <div className="w-full">
                      <p className="font-medium">
                        {driverName} (
                        {trip.vehicle.plate_number} | {trip.vehicle.vehicle_type} |{" "}
                        {trip.vehicle.is_company_owned
                          ? "Company Owned"
                          : `Private (${trip.vehicle.subcon_name || "N/A"})`}
                        )
                      </p>

                      <p className="text-sm italic text-black/70 mt-1">
                        <strong>Helpers:</strong> {helpers}
                      </p>

                      <p className="text-sm bg-white/50 text-black px-3 py-1 rounded-md mt-1 w-full">
                        <strong>Number of Drops:</strong> {trip.num_of_drops || "__________"}
                      </p>

                      <p className="text-sm bg-white/50 text-black px-3 py-1 rounded-md mt-1 w-full">
                        <strong>Salary:</strong> {trip.base_salary || "___"}
                      </p>

                      <p className="text-sm bg-white/50 text-black px-3 py-1 rounded-md mt-1 w-full">
                        <strong>Final Drop:</strong>{" "}
                        {trip.addresses?.length > 0 && trip.clients?.length > 0
                          ? `${trip.addresses[trip.addresses.length - 1]
                              ?.split(",")
                              .slice(0, 2)
                              .map((part) => part.trim())
                              .join(", ")} (Client: ${trip.clients[trip.clients.length - 1]})`
                          : "No address available"}
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
