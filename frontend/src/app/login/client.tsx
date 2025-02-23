"use client";

import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import "./layout.css";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import Image from "next/image";

const LoginClient = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent form from refreshing the page
    setError(null);
    try {
      await login(username, password);
      router.push("/dashboard/admin/home");

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

        <div className="input-box">
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
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FaLock className="icon" />
        </div>

        {error && <span className="text-red-500">{error}</span>}
        {/* This button will trigger handleSubmit when clicked */}
        <button type="submit">Login</button>

        <div className="forgot-password">
          <a href="#">Forgot Password?</a>
        </div>
      </form>
    </div>
  );
};

export default LoginClient;
