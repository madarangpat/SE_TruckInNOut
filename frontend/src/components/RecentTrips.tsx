"use client";
import React from "react";
import Image from "next/image";

const recentTrips = [
  {
    id: 1,
    name: "Employee #1",
    client: "__________",
    destination: "__________ (___ km)",
  },
  {
    id: 2,
    name: "Employee #2",
    client: "__________",
    destination: "__________ (___ km)",
  },
  {
    id: 3,
    name: "Employee #3",
    client: "__________",
    destination: "__________ (___ km)",
  },
  {
    id: 4,
    name: "Employee #4",
    client: "__________",
    destination: "__________ (___ km)",
  },
  {
    id: 5,
    name: "Employee #5",
    client: "__________",
    destination: "__________ (___ km)",
  },
  {
    id: 6,
    name: "Employee #6",
    client: "__________",
    destination: "__________ (___ km)",
  },
  {
    id: 7,
    name: "Employee #7",
    client: "__________",
    destination: "__________ (___ km)",
  },
  {
    id: 8,
    name: "Employee #8",
    client: "__________",
    destination: "__________ (___ km)",
  },
  {
    id: 9,
    name: "Employee #9",
    client: "__________",
    destination: "__________ (___ km)",
  },
  {
    id: 10,
    name: "Employee #10",
    client: "__________",
    destination: "__________ (___ km)",
  },
];

const RecentTrips = () => {
  return (
    <div className="wrapper w-full max-w-5xl rounded-2xl shadow-lg p-6 bg-black/40">
      <div className="flex justify-center items-center mx-3 gap-2">
        <h2 className="capitalize text-2xl font-semibold flex items-center gap-2 mb-4 text-black/40">
          <Image
            src="/package.png"
            alt="Recent Trips"
            width={30}
            height={30}
            className="opacity-40"
          />
          Recent Trips
        </h2>
      </div>

      {/* Scrollable list of trips */}
      <div className="innerwrapper max-h-[250px] overflow-y-auto bg-gray-900 rounded-lg p-3 border-2 border-white flex flex-col">
        {recentTrips.length > 0 ? (
          recentTrips.map((trip) => (
            <div
              key={trip.id}
              className="wrappersmall2 flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-600 text-white w-full"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left w-full">
                {/* Profile image */}
                <div className="wrappersmall2 w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border-2 border-white">
                  <Image
                    src="/accountsblk.png"
                    alt="Status"
                    width={70}
                    height={70}
                    className="opacity-70"
                  />
                </div>

                {/* Trip details */}
                <div className="w-full">
                  <p className="font-medium">{trip.name} (Vehicle Used)</p>
                  <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
                    <strong>CLIENT:</strong> {trip.client}
                  </p>
                  <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
                    <strong>DESTINATION:</strong> {trip.destination}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-center text-lg">No Recent Trips.</p>
        )}
      </div>

      {/* Create New Trip Button */}
      <div className="mt-4 flex justify-center">
        <button className="px-6 py-3 bg-green-700 text-white text-sm rounded-lg hover:bg-green-800 flex items-center gap-2">
          <Image
            src="/plustrip2.png"
            alt="Recent Trips"
            width={20}
            height={20}
            className="opacity-90"
          />
          Create New Trip
        </button>
      </div>
    </div>
  );
};

export default RecentTrips;