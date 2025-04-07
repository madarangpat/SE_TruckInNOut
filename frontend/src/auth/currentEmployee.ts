import { redirect } from "next/navigation";
import { cache } from "react";
import { getSession } from "./session";
import { getEmployeeProfile } from "@/lib/actions/employee.actions";

function _getCurrentEmployee(options: { withEmployeeProfile: true }): Promise<Employee>;
function _getCurrentEmployee(options?: { withEmployeeProfile?: false }): Promise<User | null>;

async function _getCurrentEmployee({
  withEmployeeProfile = false,
}: { withEmployeeProfile?: boolean } = {}): Promise<User | Employee | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  if (withEmployeeProfile) {
    try {
      const employeeData = await getEmployeeProfile(); // ✅ fetches employee with nested user
      return employeeData;
    } catch (error) {
      console.error("❌ Error fetching employee profile:", error);
      return session.user; // fallback to user if employee fetch fails
    }
  } else {
    return session.user;
  }
}

export const getCurrentEmployee = cache(() =>
  _getCurrentEmployee({ withEmployeeProfile: true }) as Promise<Employee>
);