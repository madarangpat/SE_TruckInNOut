import Providers from "@/components/Providers";
import { QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TruckIn-N-Out",
  description: "Employee logging and payroll system.",
};

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <Providers>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&libraries=places&callback=initAddressAutocomplete`}
          async
          defer
        />
        <Toaster richColors position="top-center" duration={2000} />
        <body className={inter.className}>{children}</body>
      </Providers>
    </html>
  );
}
