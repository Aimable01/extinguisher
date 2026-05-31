"use client";

import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export default function Input({ error, label, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm text-gray-300">{label}</label>}

      <input
        {...props}
        className="
          w-full
          rounded-xl
          border
          border-gray-700
          bg-gray-900
          px-4
          py-3
          text-white
          focus:border-blue-500
        "
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
