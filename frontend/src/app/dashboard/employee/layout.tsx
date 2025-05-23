import EmployeeNavbar from "@/components/EmployeeNavbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col">
      <EmployeeNavbar />
      <div className="flex-1 overflow-auto p-4">{children}</div>
    </div>
  );
}