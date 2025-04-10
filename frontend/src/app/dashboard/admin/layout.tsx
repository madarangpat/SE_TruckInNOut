import Link from "next/link";
import Image from "next/image";
import Menu from "@/components/Menu";
import "leaflet/dist/leaflet.css";
import AdminProfile from "@/components/AdminProfile";
import { getCurrentUser } from "@/auth/currentUser";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser({ withEmployeeProfile: true });

  return (
    <div className="flex flex-1 flex-row h-screen">
      {/* LEFT (Sidebar) */}
      <div className="bg-gradient-to-b from-white/25 to-white/25 border-2 border-white/20 shadow-xl text-white rounded-2xl my-4 mx-3 w-[20%] md:w-[10%] lg:w-[16%] xl:w-[14%] p-4 flex flex-col items-center justify-between">
        <Menu />
        <AdminProfile user={currentUser} />
      </div>

      {/* RIGHT (Main Content) */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%]">{children}</div>
    </div>
  );
}


