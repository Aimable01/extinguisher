"use client";

import { useRouter } from "next/navigation";

import { clearToken } from "@/lib/auth";

export default function Header() {
  const router = useRouter();

  const logout = () => {
    clearToken();

    router.push("/login");
  };

  return (
    <header
      className="
      flex justify-between items-center
      bg-gray-800
      p-5
      border-b border-gray-700
    "
    >
      <h2 className="font-semibold">Fire Extinguisher Management</h2>

      <button
        onClick={logout}
        className="
          bg-red-600
          px-4 py-2
          rounded-lg
        "
      >
        Logout
      </button>
    </header>
  );
}
