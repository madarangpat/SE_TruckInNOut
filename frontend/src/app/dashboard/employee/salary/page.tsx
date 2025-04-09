import React from "react";
import SalaryPageClient from "./SalaryPageClient";
import { getUserProfile } from "@/lib/actions/user.actions";

export default async function SalaryPage() {
  const user = await getUserProfile()

  console.log(user);

  return <SalaryPageClient user={user} />;
}
