import React from "react";
import MyProfileClient from "./MyProfileClient";
import { getUserProfile } from "@/lib/actions/user.actions";

export default async function EmployeeDataPage() {
  const user = await getUserProfile()

  console.log(user);

  return <MyProfileClient user={user} />;
}