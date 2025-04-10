import { redirect } from "next/navigation";
import { getCurrentUser } from "@/auth/currentUser";

export default async function DashboardPage() {
  const user = await getCurrentUser({ withEmployeeProfile: true });
  console.log("ROLE CHECK:", {
    role: user.role,
    isAdmin: user.role === "admin",
    isSuperAdmin: user.role === "super_admin",
    isEmployee: user.role === "employee",
  });

  if (user.role === "admin" || user.role === "super_admin") {
    console.log("Redirecting to admin home");
    redirect("/dashboard/admin/home");
  } else if (user.role === "employee") {   
      redirect("/dashboard/employee/home");    
  }

  // Fallback
  return <div>Loading dashboard...</div>;
}
