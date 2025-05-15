"use server";

import { getSession } from "@/auth/session";

export async function generateSalaryBreakdownPdf(
  params: string,
): Promise<Blob> {
  const session = getSession();
  console.log(session);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/generate-pdf/salary-breakdown/?${params}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.access}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to fetch salary breakdown PDF: ${error}`);
  }

  // parse the response as a binary Blob
  const pdfBlob = await res.blob();
  return pdfBlob;
}
