import React from "react";
import AccountsClient from "./AccountsClient";
import { getSession } from "@/lib/auth";

export default async function AccountsPage() {
  const session = await getSession();
  const url = `${process.env.DOMAIN}/users/`;
  const requestOptions: RequestInit = {
    cache: "no-store",
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.access!}`,
    },
  };

  const response = await fetch(url, requestOptions);
  const data = await response.json();

  if (!Array.isArray(data)) {
    console.error("Unexpected users response:", data);
    throw new Error("Failed to fetch users.");
  }

  console.log("Fetched users:", data);


  return <AccountsClient users={data} />


  // const response = await fetch(url, requestOptions);
  // const users = (await response.json()) as User[];

  // return <AccountsClient users={users} />;
  
}