"use client";

import Link from "next/link";
import Image from "next/image";

const HomePage = () => {
  const accountOwner = "Patrick Madarang"; // Replace dynamically if needed

  return (
    <div className="h-screen flex flex-col justify-start px-6 md:px-12 py-10">
      {/* Welcome Message - Positioned at the Top Left */}
      <div className="self-start mb-36 md:mb-44">
        <h2 className="text-lg md:text-2xl text-black/50 font-semibold">
          Welcome Back,
        </h2>
        <h1 className="text-2xl md:text-5xl font-bold text-black/50">
          {accountOwner}!
        </h1>
      </div>

      {/* Navigation Buttons - Moved Higher */}
      <div className="flex flex-1 items-start justify-center w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl md:max-w-4xl">
          <Link href="/dashboard/employee/deliveries">
            <button className="home-btn flex items-center justify-center w-full px-4 py-3 md:py-4 text-lg md:text-xl">
              <Image
                src="/truck.png"
                alt="Deliveries"
                width={35}
                height={35}
                className="mr-3 opacity-60"
              />
              <span className="text-black/60">Deliveries</span>
            </button>
          </Link>

          <Link href="/dashboard/employee/salary">
            <button className="home-btn flex items-center justify-center w-full px-4 py-3 md:py-4 text-lg md:text-xl">
              <Image
                src="/pesoblk.png"
                alt="Salary"
                width={35}
                height={35}
                className="mr-3 opacity-60"
              />
              <span className="text-black/60">Salary</span>
            </button>
          </Link>

          <Link href="/dashboard/employee/profile">
            <button className="home-btn flex items-center justify-center w-full px-4 py-3 md:py-4 text-lg md:text-xl">
              <Image
                src="/accountsblk.png"
                alt="MyProfile"
                width={35}
                height={35}
                className="mr-3 opacity-60"
              />
              <span className="text-black/60">My Profile</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;