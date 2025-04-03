import Link from "next/link";
import Image from "next/image";
import Menu from "@/components/Menu";
import "leaflet/dist/leaflet.css";
import "./layout.css";
import AdminProfile from "@/components/AdminProfile";
import { getCurrentUser } from "@/auth/currentUser";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser({withEmployeeProfile: true})

  return (
    <div className="flex flex-1 flex-row h-screen">
      {/* LEFT (Sidebar) */}
      <div className="wrapper rounded-2xl my-4 mx-3 w-[20%] md:w-[10%] lg:w-[16%] xl:w-[14%] p-4 flex flex-col items-center justify-between">
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
            Truck-In-N-Out
          </Link>
          <Menu />
        </div>
        <AdminProfile user={currentUser} />
      </div>

      {/* RIGHT (Main Content) */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%]">
        {children}
      </div>
    </div>
  );
}
