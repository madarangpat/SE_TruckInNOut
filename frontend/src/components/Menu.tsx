import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { getSessionRefresh, logout } from "@/lib/auth";
import SettingsOverlay from "@/components/SettingsOverlay"; // Import the new settings overlay

const menuItems = [
  {
    items: [
      { icon: "/homee.png", label: "Dashboard", href: "/dashboard/admin/home" },
      { icon: "/deliveries.png", label: "View Deliveries", href: "/dashboard/admin/viewdeliveries",},
      { icon: "/payroll.png", label: "Manage Payroll", href: "/dashboard/admin/managepayroll",
      },
    ],
  },
  {
    items: [
      { icon: "/accounts.png", label: "Accounts", href: "/dashboard/admin/accounts",},
      { icon: "/settings.png", label: "Settings" }, // Prevent navigation on click
      { icon: "/logoutt.png", label: "Logout", href: "/login" },
    ],
  },
];

const Menu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      {/* Sidebar Navigation */}
        <div className="mt-4 text-sm relative">
          {menuItems.map((group, index) => (
            <div className="flex flex-col gap-3" key={index}>
              {group.items.map((item) =>
                item.label === "Settings" ? (
                  // Settings - Open Overlay
                  <button
                    key={item.label}
                    onClick={() => setShowSettings(true)}
                    // href="/dashboard/admin/settings?openSettings=true"
                    className="flex items-center justify-center lg:justify-start gap-5 text-white py-2 rounded-lg transition duration-200 hover:bg-black/25"
                  >
                    <Image src={item.icon} alt="menu-icon" width={30} height={30} />
                    <span className="hidden lg:block">{item.label}</span>
                  </button>) : 
                  item.label === "Logout" ? (
                  // Logout - Redirect after logout
                  <button
                    key={item.label}
                    onClick={async () => {
                      await logout();
                      router.push("/login");
                    }}
                    className="flex items-center justify-center lg:justify-start gap-5 text-white py-2 rounded-lg transition duration-200 hover:bg-black/25"
                  >
                    <Image src={item.icon} alt="menu-icon" width={30} height={30} />
                    <span className="hidden lg:block">{item.label}</span>
                  </button>
                ) : (
                  // Regular Navigation - Uses <Link>
                  <Link
                    href={item.href}
                    key={item.label}
                    className={`flex items-center justify-center lg:justify-start gap-5 text-white py-2 rounded-lg transition duration-200 hover:bg-black/25 ${
                      pathname === item.href ? "bg-black/25" : ""
                    }`}
                  >
                    <Image src={item.icon} alt="menu-icon" width={30} height={30} />
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                )
              )}
            </div>
          ))}
        </div>

      {/* Settings Overlay */}
      {showSettings && <SettingsOverlay onClose={() => setShowSettings(false)} />}
    </>
  );
};

export default Menu;