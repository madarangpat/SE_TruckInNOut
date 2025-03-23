"use client";
import Image from "next/image";

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
];

const TripsInTransit = () => {
  return (
    <div className="wrapper rounded-2xl p-4 flex-1 shadow-md h-full w-full flex flex-col">
      <div className="flex justify-start items-center mx-3 gap-2">
        <h1 className="capitalize text-2xl font-medium text-black/40">
          Trips In Transit
        </h1>
        <Image
          src="/truck.png"
          alt="Truck"
          width={40}
          height={40}
          className="opacity-40"
        />
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden max-h-[200px] bg-black/40 rounded-lg p-3">
        {employeesInTransit.length > 0 ? (
          employeesInTransit.map((employee) => (
            <div
              key={employee.id}
              className="flex justify-between items-center p-2 border-b border-gray-600 text-white w-full"
            >
              <span>{employee.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-lg">
                  {employee.status}
                </span>
                <Image
                  src="/truck.png"
                  alt="Truck"
                  width={30}
                  height={30}
                  className="opacity-40"
                />
              </div>
            </div>
          ))
        ) : (
          <span className="text-white text-center text-sm">
            NO TRIPS IN TRANSIT.
          </span>
        )}
      </div>
    </div>
  );
};

export default TripsInTransit;
