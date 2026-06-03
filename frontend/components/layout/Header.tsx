"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { clearToken } from "@/lib/auth";
import Modal from "../ui/Modal";

export default function Header() {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // This handles the actual logout logic once confirmed
  const handleConfirmLogout = () => {
    clearToken();
    setIsLogoutModalOpen(false);
    router.push("/login");
  };

  return (
    <header
      className="flex justify-between items-center p-5 border-b"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "#D2D2D2",
      }}
    >
      <h2 className="font-semibold" style={{ color: "#2F2F2F" }}>
        Fire Extinguisher Management
      </h2>

      <button
        onClick={() => setIsLogoutModalOpen(true)}
        className="px-4 py-2 rounded-lg transition hover:bg-red-700"
        style={{
          backgroundColor: "#D32F2F",
          color: "#FFFFFF",
        }}
      >
        Logout
      </button>

      <Modal
        open={isLogoutModalOpen}
        title="Confirm Logout"
        message="Are you sure you want to log out of your account?"
        confirmLabel="Logout"
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </header>
  );
}
