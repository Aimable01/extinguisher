"use client";

import Link from "next/link";

import { FireExtinguisher } from "@/types";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface Props {
  data: FireExtinguisher[];
  onDelete: (id: string) => void;
}

export default function ExtinguisherTable({ data, onDelete }: Props) {
  return (
    <div className="card overflow-auto">
      <table className="w-full">
        <thead>
          <tr
            className="
            text-left
            border-b
            border-gray-700
            "
          >
            <th className="pb-3">ID</th>

            <th className="pb-3">Owner</th>

            <th className="pb-3">ID Number</th>

            <th className="pb-3">Expiry</th>

            <th className="pb-3">Status</th>

            <th className="pb-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((extinguisher) => (
            <tr
              key={extinguisher._id}
              className="
                border-b
                border-gray-800
                "
            >
              <td className="py-4">{extinguisher.extinguisherId}</td>

              <td>{extinguisher.ownerName}</td>

              <td>{extinguisher.ownerIdNumber}</td>

              <td>
                {new Date(extinguisher.expirationDate).toLocaleDateString()}
              </td>

              <td>
                <Badge status={extinguisher.status} />
              </td>

              <td>
                <div className="flex gap-2">
                  <Link href={`/dashboard/extinguishers/${extinguisher._id}`}>
                    <Button>View</Button>
                  </Link>

                  <Link
                    href={`/dashboard/extinguishers/${extinguisher._id}/edit`}
                  >
                    <Button>Edit</Button>
                  </Link>

                  <Button
                    variant="danger"
                    onClick={() => onDelete(extinguisher._id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
