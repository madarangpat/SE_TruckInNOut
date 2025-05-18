import { getSession } from "@/auth/session";
import SalaryBreakdownClient from "./SalaryBreakdownClient";

export default function SalaryBreakdown() {
  const session = getSession();

  return <SalaryBreakdownClient session={session!} />;
}
