"use client";

interface Props {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function Modal({
  open,
  title,
  message,
  onConfirm,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="
      fixed inset-0
      flex items-center justify-center
      bg-black/70
      z-50
    "
    >
      <div className="bg-gray-900 p-6 rounded-xl w-[400px]">
        <h2 className="text-lg font-bold mb-4">{title}</h2>

        <p className="text-gray-300 mb-6">{message}</p>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-gray-700 py-2 rounded">
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
