import React from "react";
import "./layout.css";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import Image from "next/image";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>{children}</div>
  );
}
