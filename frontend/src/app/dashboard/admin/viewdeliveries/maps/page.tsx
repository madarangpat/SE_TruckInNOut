"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

const employeesInTransit = [
  {
    id: 1,
    name: "Employee #1",
    client: "__________",
    destination: "__________ (___ km)",
    location: "Area 1",
  },
  {
    id: 2,
    name: "Employee #2",
    client: "__________",
    destination: "__________ (___ km)",
    location: "Area 2",
  },
  {
    id: 3,
    name: "Employee #3",
    client: "__________",
    destination: "__________ (___ km)",
    location: "Area 3",
  },
  {
    id: 4,
    name: "Employee #4",
    client: "__________",
    destination: "__________ (___ km)",
    location: "Area 4",
  },
  {
    id: 5,
    name: "Employee #5",
    client: "__________",
    destination: "__________ (___ km)",
    location: "Area 5",
  },
];

const MapsPage = () => {
  const searchParams = useSearchParams();
  const employeeId = searchParams.get("employee"); // Get employee ID from URL

  const [employee, setEmployee] = useState<null | {
    id: number;
    name: string;
    client: string;
    destination: string;
    location: string;
  }>(null);

  useEffect(() => {
    console.log("Employee ID from URL:", employeeId);
    if (employeeId) {
      const foundEmployee = employeesInTransit.find(
        (emp) => emp.id === Number(employeeId)
      );
      console.log("Found Employee:", foundEmployee);
      setEmployee(foundEmployee || null);
    }
  }, [employeeId]);

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 md:px-8">
      <div className="wrapper w-full max-w-5xl mx-auto p-6 rounded-2xl bg-black/40 shadow-lg">
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

        {employee ? (
          <div className="wrapper p-4 rounded-lg border-2 border-white text-white">
            {/* Employee Details */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-black/25 rounded-full flex items-center justify-center border-2 border-white">
                <Image
                  src="/accountsblk.png"
                  alt="Status"
                  width={70}
                  height={70}
                  className="opacity-70"
                />
              </div>
              <div className="w-full text-center md:text-left">
                <p className="text-black/55 font-medium">
                  {employee.name} (Vehicle Used)
                </p>
                <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
                  <strong>CLIENT:</strong> {employee.client}
                </p>
                <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
                  <strong>DESTINATION:</strong> {employee.destination}
                </p>
                <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
                  <strong>LOCATION:</strong> {employee.location}
                </p>
              </div>
            </div>

            <div className="innerwrapper mt-7 w-full h-72 md:h-96 bg-gray-700 rounded-lg flex justify-center items-center">
              <Image
                src="/map-placeholder.png"
                alt="No Map Found."
                width={690}
                height={350}
                className="rounded-lg object-contain"
              />
            </div>
          </div>
        ) : (
          <p className="text-white text-center">Employee not found.</p>
        )}
      </div>
    </div>
  );
};

export default MapsPage;