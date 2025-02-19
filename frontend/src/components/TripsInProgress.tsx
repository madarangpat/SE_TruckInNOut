"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const employeesInTransit = [
  { id: 1, name: "Employee #1", status: "ONGOING" },
  { id: 2, name: "Employee #2", status: "ONGOING" },
  { id: 3, name: "Employee #3", status: "ONGOING" },
  { id: 4, name: "Employee #4", status: "ONGOING" },
  { id: 5, name: "Employee #5", status: "ONGOING" },
  { id: 6, name: "Employee #6", status: "ONGOING" },
  { id: 7, name: "Employee #7", status: "ONGOING" },
  { id: 8, name: "Employee #8", status: "ONGOING" },
  { id: 9, name: "Employee #9", status: "ONGOING" },
  { id: 10, name: "Employee #10", status: "ONGOING" },
  { id: 11, name: "Employee #11", status: "ONGOING" },
  { id: 12, name: "Employee #12", status: "ONGOING" },
  { id: 13, name: "Employee #13", status: "ONGOING" },
  { id: 14, name: "Employee #14", status: "ONGOING" },
  { id: 15, name: "Employee #15", status: "ONGOING" },
  { id: 16, name: "Employee #16", status: "ONGOING" },
  { id: 17, name: "Employee #17", status: "ONGOING" },
  { id: 18, name: "Employee #18", status: "ONGOING" },
  { id: 19, name: "Employee #19", status: "ONGOING" },
  { id: 20, name: "Employee #20", status: "ONGOING" },
];

const TripsInProgress = () => {
  const router = useRouter();

  const handleEmployeeClick = (id: number) => {
    router.push(`/dashboard/admin/viewdeliveries/maps?employee=${id}`);
  };

  return (
    <div className="wrapper w-full max-w-5xl rounded-2xl shadow-lg p-6 mb-8 bg-black/40">
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

      <div className="innerwrapper max-h-[300px] min-h-[150px] p-5 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 flex items-center justify-center">
        {employeesInTransit.length > 0 ? (
          employeesInTransit.map((employee) => (
            <div
              key={employee.id}
              className="wrappersmall flex flex-col items-center justify-center bg-gray-900 rounded-lg p-4 border-2 border-white cursor-pointer hover:bg-gray-800"
              onClick={() => handleEmployeeClick(employee.id)}
            >
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border-2 border-white">
                <Image
                  src="/accounts.png"
                  alt="Status"
                  width={70}
                  height={70}
                  className="opacity-70"
                />
              </div>
              <span className="mt-2 text-sm text-white/90">
                {employee.name}
              </span>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-white text-center text-lg">No Current Trip/s.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripsInProgress;