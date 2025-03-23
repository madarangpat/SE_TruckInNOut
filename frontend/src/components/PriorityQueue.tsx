"use client";
import Image from "next/image";

const priorityQueue = [
  { id: 9, name: "Employee #9", trips: 60 },
  { id: 5, name: "Employee #5", trips: 40 },
  { id: 3, name: "Employee #3", trips: 30 },
  { id: 2, name: "Employee #2", trips: 20 },
  { id: 11, name: "Employee #11", trips: 18 },
];

const PriorityQueue = () => {
  return (
    <div className="wrapper rounded-2xl p-4 flex-1 shadow-md h-full w-full flex flex-col">
      <div className="flex justify-center items-center mx-3 gap-2">
        <h1 className="capitalize text-2xl font-medium text-black/40">
          Priority Queue
        </h1>
        <Image
          src="/prioqueue.png"
          alt="Queue"
          width={30}
          height={30}
          className="opacity-40"
        />
      </div>
      <div className="flex-1 overflow-auto bg-black/40 rounded-lg p-3">
        {priorityQueue.map((employee) => (
          <div
            key={employee.id}
            className="flex justify-between items-center p-2 border-b border-gray-600 text-white"
          >
            <span>{employee.name}</span>
            <span className="text-xs bg-black/25 text-white px-2 py-1 rounded-lg">
              {employee.trips} TRIP/S COMPLETED
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityQueue;
