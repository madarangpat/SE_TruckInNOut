"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { changePassword } from "@/lib/actions/user.actions";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const ChangePasswordPage = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPasswords(!showPasswords);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    try {
      setLoading(true);
      await changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully!");
      router.push("/dashboard/employee/myprofile");
    } catch (error: any) {
      toast.error(error.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  const inputType = showPasswords ? "text" : "password";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-28">
      <div className="wrapper w-full max-w-lg p-6 rounded-xl shadow-lg bg-gray-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
            Change Password
          </h2>

          {[
            {
              label: "Current Password",
              value: currentPassword,
              onChange: (e: any) => setCurrentPassword(e.target.value),
            },
            {
              label: "New Password",
              value: newPassword,
              onChange: (e: any) => setNewPassword(e.target.value),
            },
            {
              label: "Confirm New Password",
              value: confirmPassword,
              onChange: (e: any) => setConfirmPassword(e.target.value),
            },
          ].map((field, i) => (
            <div className="space-y-2 relative" key={i}>
              <label className="text-gray-600 text-sm">{field.label}</label>
              <input
                type={inputType}
                value={field.value}
                onChange={field.onChange}
                className="w-full border border-gray-400 px-3 py-2 rounded text-sm text-stone-950 pr-10"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-9 right-3 text-gray-500"
              >
                {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          ))}

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-32 py-2 px-4 rounded text-sm font-medium text-white ${
                loading ? "bg-gray-400" : "bg-[#668743] hover:bg-[#345216]"
              }`}
            >
              {loading ? "Changing..." : "Confirm Change"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
