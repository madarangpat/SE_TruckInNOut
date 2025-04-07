"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { acceptTrip, declineTrip } from "@/lib/actions/deliveries.actions";
import { useRouter } from "next/navigation";

type DeliveriesClientProps = {
  assignedTrip: Trip;
  recentTrips: Trip[];
  ongoingTrips: Trip[];
};

type Trip = {
  trip_id: number;
  full_destination?: string;
  client_info: string;
  num_of_drops: number;
  start_date: string;
  end_date?: string;
  is_completed: boolean;
  vehicle: {
    plate_number: string;
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
  assignedTrip,
  recentTrips,
  ongoingTrips,
}: DeliveriesClientProps) => {
  const router = useRouter();

  const handleEmployeeClick = (employeeId: number) => {
    router.push(`/dashboard/employee/viewdeliveries/maps?employee=${employeeId}`);
  };

  return (
    <div className="min-h-fit flex flex-col items-center justify-center px-4 sm:px-6 lg:px-10 pt-4">
      {/* Ongoing Trips */}
      <div className="wrapper w-full max-w-5xl rounded-2xl shadow-lg p-6 my-8 bg-black/40">
          <div className="flex justify-center items-center mx-3 gap-2">
              <h2 className="capitalize text-2xl font-semibold flex items-center gap-2 mb-4 text-black/40">
              <Image src="/truck.png" alt="Truck" width={40} height={40} className="opacity-40" />
              Ongoing Trips
              </h2>
          </div>

          <div className="innerwrapper max-h-[300px] min-h-[150px] p-5 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 flex items-center justify-center">
              {ongoingTrips.length > 0 ? (
              ongoingTrips.map((trip) => (
                  <div
                  key={trip.trip_id}
                  className="wrappersmall flex flex-col items-center justify-center bg-[#668743] hover:bg-[#345216] transition rounded-lg p-4 cursor-pointer"
                  onClick={() => trip.employee && handleEmployeeClick(trip.employee.employee_id)}
                  >
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border-2 border-white">
                      <Image
                      src={
                          trip.employee?.user?.profile_image
                          ? trip.employee.user.profile_image
                          : "/accounts.png"
                      }
                      alt="Profile"
                      width={70}
                      height={70}
                      className="rounded-full object-cover opacity-90"
                      />
                  </div>
                  <span className="mt-2 text-sm text-white/90">
                      {trip.employee?.user?.username || "No Employee"}
                  </span>
                  </div>
              ))
              ) : (
              <p className="text-white text-center text-lg">No Current Trip/s.</p>
              )}
          </div>
      </div>


      {/* Recent Trips */}
      <div className="wrapper w-full max-w-4xl rounded-xl shadow-lg p-6 bg-black/20">
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

        <div className="innerwrapper max-h-[250px] overflow-y-auto bg-gray-900 rounded-lg p-3 border-2 border-white flex flex-col">
          {recentTrips.length > 0 ? (
            recentTrips.map((trip) => (
              <div
                key={trip.trip_id}
                className="wrappersmall flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-600 text-white w-full"
              >
                <div className="innerwrapper w-ful rounded-md p-3">
                  <p className="text-xs text-white uppercase">
                    <strong>Status:</strong>
                    {trip.is_completed &&
                      ` (Completed on ${trip.end_date?.split("T")[0]})`}
                  </p>
                  <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
                    <strong>CLIENT:</strong> {trip.client_info}
                  </p>
                  <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
                    <strong>DESTINATION:</strong> {trip.full_destination}
                  </p>
                  <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
                    <strong>VEHICLE USED:</strong> {trip.vehicle.plate_number}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white text-center text-lg">No Trips Recently.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveriesClient;

