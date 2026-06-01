"use client";

import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;

  variant?: "primary" | "danger" | "secondary";
}

export default function Button({
  children,
  loading,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={clsx(
        "w-full rounded-xl px-4 py-3 font-medium transition",
        {
          "bg-blue-600 hover:bg-blue-700": variant === "primary",

          "bg-red-600 hover:bg-red-700": variant === "danger",

          "bg-gray-700 hover:bg-gray-600": variant === "secondary",
        },
        "disabled:opacity-50",
        className,
      )}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
