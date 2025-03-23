import EmployeeNavbar from "@/components/EmployeeNavbar";
import MenuEmp from "@/components/MenuEmp";

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