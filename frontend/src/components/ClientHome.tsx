"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import the tracking component (client-only)
const TrackEmployeeLocation = dynamic(() => import("@/components/TrackEmployeeLocation"), {
  ssr: false,
});

interface Props {
  user: {
    id: number;
    username?: string;
    profile_image?: string | null;
    role?: string;
    // add other props if needed
  } | null;
}

const ClientHome = ({ user }: Props) => {
  useEffect(() => {
    console.log("🧭 ClientHome loaded with user:", user);
  }, [user]);

  const navButtons = [
    { route: "/dashboard/employee/deliveries", image: "/truck.png", label: "Deliveries" },
    { route: "/dashboard/employee/salary", image: "/pesoblk.png", label: "Salary" },
    { route: "/dashboard/employee/myprofile", image: "/accountsblk.png", label: "MyProfile" },
  ];

  return (
    <div className="h-90vh flex flex-col justify-start px-6 md:px-12 py-10">
      {/* ✅ Track only if user is employee */}
      {user?.role === "employee" && user?.id && (
        <TrackEmployeeLocation employeeId={user.id} />
      )}

      <div className="self-start mb-36 md:mb-44">
        <h2 className="text-lg md:text-2xl text-black/50 font-semibold">Welcome Back,</h2>
        <div className="flex items-center gap-4">
          <div className="relative size-20 bg-green-100 rounded-full overflow-hidden">
            <Image
              src={user?.profile_image ?? "/userplaceholder.png"}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl md:text-5xl font-bold text-black/50">
            {user?.username || "Loading..."}
          </h1>
        </div>
      </div>

      <div className="flex flex-1 items-start justify-center w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl md:max-w-4xl">
          {navButtons.map((item, key) => (
            <div
              key={key}
              className="flex items-center justify-center bg-[#C7D6AE] shadow-md text-[1.2rem] font-semibold text-black transition-all duration-300 ease-in-out px-7 py-3.5 rounded-2xl hover:bg-[#D8E5C1] hover:shadow-lg"
            >
              <Link href={item.route} className="flex items-center gap-2">
                <Image
                  src={item.image}
                  alt={item.label}
                  width={35}
                  height={35}
                  className="opacity-60"
                />
                <span className="text-black/60">{item.label}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientHome;
