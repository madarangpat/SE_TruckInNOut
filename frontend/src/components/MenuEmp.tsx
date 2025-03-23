"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    items: [
      {
        icon: "/homee.png",
        label: "Dashboard",
        href: "/dashboard/admin/home",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/deliveries.png",
        label: "View Deliveries",
        href: "/dashboard/admin/viewdeliveries",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/payroll.png",
        label: "Manage Payroll",
        href: "/dashboard/admin/managepayroll",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    items: [
      {
        icon: "/accounts.png",
        label: "Accounts",
        href: "/dashboard/admin/accounts",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/settings.png",
        label: "Settings",
        href: "/dashboard/admin/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/logoutt.png",
        label: "Logout",
        href: "/login",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const MenuEmp = () => {
  const pathname = usePathname();
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i, index) => (
        <div className="flex flex-col gap-3" key={index}>
          {i.items.map((item) => (
            <Link
              href={item.href}
              key={item.label}
              className={`flex items-center justify-center lg:justify-start gap-5 text-white py-2 rounded-lg transition duration-200 hover:bg-black/25 ${
                pathname === item.href ? "bg-black/25" : ""
              }`}
            >
              <Image src={item.icon} alt="" width={30} height={30} />
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MenuEmp;