"use client";

import React, { forwardRef } from "react";

interface Props
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<
  HTMLTextAreaElement,
  Props
>(({ label, error, ...props }, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm text-gray-300">
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        {...props}
        rows={4}
        className="
          w-full
          bg-gray-900
          border
          border-gray-700
          rounded-lg
          px-4
          py-3
          text-white
        "
      />

      {error && (
        <p className="text-red-400 text-sm">
          {error}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;