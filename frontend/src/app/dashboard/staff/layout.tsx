import StaffNavbar from "@/components/StaffNavbar";


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col">
      <StaffNavbar />
      <div className="flex-1 overflow-auto p-4">{children}</div>
    </div>
  );
}