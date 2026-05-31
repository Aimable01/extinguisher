import { ExtinguisherStatus } from "@/types";

interface Props {
  status: ExtinguisherStatus;
}

export default function Badge({ status }: Props) {
  const colors = {
    active: "bg-green-500 text-white",

    expired: "bg-red-500 text-white",

    reported: "bg-yellow-500 text-black",

    police_notified: "bg-red-700 text-white",
  };

  return (
    <span
      className={`
        px-3 py-1 rounded-full text-xs
        ${colors[status]}
      `}
    >
      {status}
    </span>
  );
}
