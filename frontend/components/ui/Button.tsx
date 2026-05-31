"use client";

import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function Button({
  children,
  loading,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={clsx(
        "w-full rounded-xl bg-blue-600 px-4 py-3 font-medium transition",
        "hover:bg-blue-700",
        "disabled:opacity-50",
        className,
      )}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
