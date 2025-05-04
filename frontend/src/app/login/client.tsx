"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import "./layout.css";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { login } from "@/auth/auth.actions";
const LoginClient = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Get form data directly
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    
    try {
      // Call login function with form values
      await login(username, password);
      router.push("/dashboard")
    } catch (err) {
      setError('Login failed. Please check your credentials.');
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

      <form onSubmit={handleSubmit}>
        <h1>Hello,</h1>
        <h1>Welcome Back!</h1>
        <p>Welcome back to TruckIn-N-Out, Happy Trucking!</p>

        <div className="input-box items-center">
          <input
            type="text"
            placeholder="Username"
            name="username"
            required
          />
          <FaUser className="icon" />
        </div>

        <div className="input-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            name="password"
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

        <button type="submit">Login</button>

        <div className="forgot-password">
          <Link href="/forgot-password">Forgot Password?</Link>
        </div>
      </form>
      <div className="bigc-logo-container">
        <Image
          src="/bigc.png"
          alt="Big-C Logo"
          width={200} // adjust as needed
          height={200}
        />
      </div>
    </div>
  );
};

export default LoginClient;
