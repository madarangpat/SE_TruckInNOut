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
          Dashboard
        </h1>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="burger-menu text-black/50 text-2xl"
        >
          ☰
        </button>
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
            className="menu-item"
            onClick={closeSidebar}
          >
            <Image src="/homee.png" alt="Home" width={24} height={24} />
            <span>Home</span>
          </Link>
          <Link
            href="/dashboard/employee/deliveries"
            className="menu-item"
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
            className="menu-item"
            onClick={closeSidebar}
          >
            <Image src="/peso.png" alt="Salary" width={30} height={30} />
            <span>Salary</span>
          </Link>
          <Link
            href="/dashboard/employee/myprofile"
            className="menu-item"
            onClick={closeSidebar}
          >
            <Image src="/accounts.png" alt="Profile" width={27} height={27} />
            <span>My Profile</span>
          </Link>
        </div>

        {/* Logout Button with Logout Functionality */}
        <div className="absolute bottom-6 w-full px-6">
          <button
            onClick={async () => {
              await logout();
              router.push("/login");
              router.refresh();
            }}
            className="menu-item flex items-center w-full text-left"
          >
            <Image src="/logoutt.png" alt="Logout" width={30} height={30} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default EmployeeNavbar;

