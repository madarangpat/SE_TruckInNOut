import { getSession } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import Menu from "@/components/Menu";
import "leaflet/dist/leaflet.css";
import "./layout.css";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = getSession();
  const user = session?.user;

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
        <div className="flex items-center gap-2">
          <div className="relative size-20 bg-green-100 rounded-full overflow-hidden">
            <Image
              src={user?.profile_image ?? "/userplaceholder.png"}
              alt="logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="hidden md:flex flex-col space-y-1">
            <span>{user?.username ? user.username : "Loading..."}</span>
          </div>
        </div>
      </div>

      {/* RIGHT (Main Content) */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%]">
        {children}
      </div>
    </div>
  );
}
