"use client";

import Link from "next/link";
import Image from "next/image";
import profile from "./public/tinoicon.png";
import Menu from "@/components/Menu";
import NavBar from "@/components/NavBar";
import "./layout.css";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="wrapper rounded-2xl my-4 mx-3 w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4 flex flex-col items-center">
        <div className="mt-12 mb-16 flex flex-col items-center">
          <Image
            src="/tinoicon.png"
            alt="logo"
            width={48}
            height={48}
            className="mb-2"
          />
          <Link
            href="/"
            className="hidden lg:block text-white text-lg font-semibold"
          >
            Admin123
          </Link>
        </div>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] overflow-scroll">
        {children}
      </div>
    </div>
  );
}
