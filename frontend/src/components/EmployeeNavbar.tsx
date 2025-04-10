"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { logout } from "@/auth/auth.actions";

const EmployeeNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  // Close sidebar when clicking outside
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <React.Fragment>
      {/* TOP NAVIGATION BAR */}
      <nav className="top-nav flex justify-between items-center bg-[#8FA479] shadow-md h-[60px] px-4 md:px-6 font-bold text-black/80">
        <h1 className="text-2xl font-semibold text-black/50 tracking-[0.3rem]">
          TruckIn-N-Out
        </h1>
      </nav>

      {/* SIDEBAR OVERLAY (Detects Clicks Outside) */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay fixed top-0 left-0 w-full h-full bg-black/50 opacity-50 z-40"
          onClick={closeSidebar}
        ></div>
      )}

      {/* SIDEBAR MENU */}
      <div
        className={`sidebar fixed top-0 right-0 h-full w-64 bg-black/70 text-white transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 shadow-lg`}
      >
        <button
          onClick={closeSidebar}
          className="close-btn absolute top-4 left-4 text-white text-2xl"
        >
          ✕
        </button>

        <div className="mt-12 flex flex-col space-y-6 p-6">
          <Link
            href="/dashboard/employee/home"
            className="menu-item flex items-center space-x-2 opacity-60"
            onClick={closeSidebar}
          >
            <Image src="/homee.png" alt="Home" width={24} height={24} />
            <span>Home</span>
          </Link>
          <Link
            href="/dashboard/employee/deliveries"
            className="menu-item flex items-center space-x-2 opacity-60"
            onClick={closeSidebar}
          >
            <Image
              src="/deliveries.png"
              alt="Deliveries"
              width={24}
              height={24}
            />
            <span>Deliveries</span>
          </Link>
          <Link
            href="/dashboard/employee/salary"
            className="menu-item flex items-center space-x-2 opacity-60"
            onClick={closeSidebar}
          >
            <Image src="/peso.png" alt="Salary" width={30} height={30} />
            <span>Salary</span>
          </Link>
          <Link
            href="/dashboard/employee/myprofile"
            className="menu-item flex items-center space-x-2 opacity-60"
            onClick={closeSidebar}
          >
            <Image src="/accounts.png" alt="Profile" width={27} height={27} />
            <span>My Profile</span>
          </Link>

          {/* Burger Icon to open sidebar */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="burger-menu text-black/50 text-2xl opacity-60"
          >
            ☰
          </button>
        </div>

        {/* Logout Button with Logout Functionality */}
        <div className="absolute bottom-6 w-full px-6">
          <button
            onClick={async () => {
              await logout();
              router.push("/login");
              router.refresh();
            }}
            className="menu-item flex items-center w-full text-left opacity-60"
          >
            <Image src="/logoutt.png" alt="Logout" width={30} height={30} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* NAVIGATION BAR BUTTONS BELOW THE HEADER */}
      <div className="flex justify-between bg-[#8FA479] py-4 px-4">
        {/* Add icons with no labels and evenly spaced */}
        <div className="flex space-x-12 w-full justify-between">
          <Link
            href="/dashboard/employee/deliveries"
            className="flex items-center justify-center bg-transparent p-2 opacity-60"
          >
            <Image src="/truck.png" alt="Deliveries" width={30} height={30} />
          </Link>
          <Link
            href="/dashboard/employee/salary"
            className="flex items-center justify-center bg-transparent p-2 opacity-60"
          >
            <Image src="/pesoblk.png" alt="Salary" width={30} height={30} />
          </Link>
          <Link
            href="/dashboard/employee/myprofile"
            className="flex items-center justify-center bg-transparent p-2 opacity-60"
          >
            <Image
              src="/accountsblk.png"
              alt="My Profile"
              width={30}
              height={30}
            />
          </Link>

          {/* Burger Button to open sidebar */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="burger-menu text-black/50 text-2xl"
          >
            ☰
          </button>

          {/* Logout Button on the Right */}
          <button
            onClick={async () => {
              await logout();
              router.push("/login");
              router.refresh();
            }}
            className="bg-transparent p-2 opacity-60"
          >
            <Image src="/logouttt.png" alt="Logout" width={30} height={30} />
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default EmployeeNavbar;
