import React from "react";
import SalaryConfigurationClient from "./SalaryConfigurationClient";
import { getSession } from "@/lib/auth";

export default async function SalaryConfigurationPage() {
  const session = getSession();
  const url = `${process.env.DOMAIN}/salary-configurations/`;
  const requestOptions: RequestInit = {
    cache: "no-store",
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.access!}`,
    },
  };

  const response = await fetch(url, requestOptions);
  const salConfig = (await response.json()) as SalConfig[];

  return <SalaryConfigurationClient salConfig={salConfig} />;
}