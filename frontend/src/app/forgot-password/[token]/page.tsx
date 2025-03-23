import React from "react";
import Client from "./Client";
import { validateResetPasswordLink } from "@/lib/actions";

export default async function ForgotPasswordToken({
  params,
}: {
  params: { token: string };
}) {
  const tokenValidation = await validateResetPasswordLink(params.token);

  if (tokenValidation.errors) {
    const errorMessage = tokenValidation.errors.error
      ? tokenValidation.errors.error.toString()
      : "An unknown error occurred.";
    throw new Error(errorMessage);
  }


  return <Client token={params.token} />;
}