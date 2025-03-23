import React from "react";
import AccountsClient from "./AccountsClient";
import { getSession } from "@/lib/auth";

export default async function AccountsPage() {
  const session = getSession();
  const url = `${process.env.DOMAIN}/users/`;
  const requestOptions: RequestInit = {
    cache: "no-store",
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.access!}`,
    },
  };

  const response = await fetch(url, requestOptions);
  const users = (await response.json()) as User[];

  return <AccountsClient users={users} />;
}