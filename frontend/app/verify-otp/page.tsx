"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { verifyOtp, resendOtp } from "@/services/authService";

import { saveToken } from "@/lib/auth";

export default function VerifyOtpPage() {
  const router = useRouter();

  const [otp, setOtp] = useState("");

  const [timer, setTimer] = useState(600);

  const email =
    typeof window !== "undefined" ? sessionStorage.getItem("otp_email") : null;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    try {
      const result = await verifyOtp(email!, otp);

      saveToken(result.token);

      toast.success("Login successful");

      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp(email!);

      setTimer(600);

      toast.success("OTP resent");
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div
      className="
      min-h-screen
      flex items-center justify-center
      bg-gray-950
    "
    >
      <div
        className="
        bg-gray-900
        p-8
        rounded-xl
        w-full
        max-w-md
      "
      >
        <h1 className="text-2xl font-bold mb-5">Verify OTP</h1>

        <input
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="
            w-full
            bg-gray-800
            text-center
            text-3xl
            tracking-[12px]
            rounded-xl
            p-4
          "
        />

        <p className="mt-4 text-gray-400">
          {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
        </p>

        <button
          onClick={handleVerify}
          className="
            w-full
            bg-blue-600
            py-3
            rounded-xl
            mt-6
          "
        >
          Verify OTP
        </button>

        <button
          disabled={timer > 0}
          onClick={handleResend}
          className="
            w-full
            mt-3
            text-blue-400
          "
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
}
