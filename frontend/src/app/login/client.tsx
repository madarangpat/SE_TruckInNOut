"use client";

import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import "./layout.css";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const LoginClient = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent form from refreshing the page
    setError(null);
    try {
      const user = await login(username, password);
      if (user.role === "admin" || user.role === "super_admin") {
        router.push("/dashboard/admin/home");
      } else if (user.role === "employee") {        
        // If employee, check employee_type
        if (user.employee_type === "Staff" ) {
          //Redirect to staff directory         
          router.push("/dashboard/staff/home");
        } else {
          //Redirect to employee directory
          router.push("/dashboard/employee/home");
        }
      }
      router.refresh();
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className="wrapper">
      <div className="logo-container">
        <Image
          src="/tinoicon.png"
          alt="TruckIn-N-Out Logo"
          className="logo-image"
          width={45}
          height={45}
        />
        <span className="logo-text">TruckIn-N-Out</span>
      </div>

      {/* Use onSubmit on the form */}
      <form onSubmit={handleSubmit}>
        <h1>Hello,</h1>
        <h1>Welcome Back!</h1>
        <p>Welcome back to TruckIn-N-Out, Happy Trucking!</p>

        <div className="input-box items-center">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <FaUser className="icon" />
        </div>

        <div className="input-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FaLock className="icon" />
        </div>

        <div
          className="text-sm text-gray-600 mt-1 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide Password" : "Show Password"}
        </div>

        {error && <span className="text-red-500">{error}</span>}

        {/* Login Button */}
        <button type="submit">Login</button>

        <div className="forgot-password">
          <Link href="/forgot-password">Forgot Password?</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginClient;
