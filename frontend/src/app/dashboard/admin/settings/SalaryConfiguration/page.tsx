import React from "react";
import SalaryConfigurationClient from "./SalaryConfigurationClient";
import { getSalaryConfigurations } from "@/lib/actions/salary.actions";

export default async function SalaryConfigurationPage() {
  const salaryConigurations = await getSalaryConfigurations();

  return <SalaryConfigurationClient salConfigs={salaryConigurations} />;
}
