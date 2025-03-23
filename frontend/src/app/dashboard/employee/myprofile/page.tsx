import React from "react";
import MyProfileClient from "./MyProfileClient";
import { getSession } from "@/lib/auth";

export default async function EmployeeDataPage() {
  const session = getSession();
  const url = `${process.env.DOMAIN}/users/profile/`;
  const requestOptions: RequestInit = {
    cache: "no-store",
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.access!}`,
    },
  };

  const response = await fetch(url, requestOptions);
  const user = (await response.json()) as User;

  return <MyProfileClient user={user} />;
}