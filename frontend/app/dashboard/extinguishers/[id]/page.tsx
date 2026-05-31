"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useParams } from "next/navigation";

import toast from "react-hot-toast";

import Button from "@/components/ui/Button";

import Badge from "@/components/ui/Badge";

import { FireExtinguisher } from "@/types";

import { extinguisherService } from "@/services/extinguisherService";

export default function Page() {
  const params = useParams();

  const [data, setData] = useState<FireExtinguisher>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await extinguisherService.getOne(params.id as string);
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch extinguisher:", error);
        toast.error("Failed to load extinguisher details");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [params.id]);

  const handleMarkReported = async () => {
    try {
      await extinguisherService.markReported(data._id);
      toast.success("Marked as reported successfully");
      // Reload the data
      const response = await extinguisherService.getOne(params.id as string);
      setData(response.data.data);
    } catch (error) {
      console.error("Failed to mark as reported:", error);
      toast.error("Failed to mark as reported");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-400">Extinguisher not found</div>
      </div>
    );
  }

  return (
    <div className="card space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{data.extinguisherId}</h1>
          <Badge status={data.status} />
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/extinguishers/${data._id}/edit`}>
            <Button>Edit</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-gray-400 text-sm">Owner Name</p>
          <p className="font-medium">{data.ownerName}</p>
        </div>

        <div className="space-y-1">
          <p className="text-gray-400 text-sm">Owner ID Number</p>
          <p className="font-medium">{data.ownerIdNumber}</p>
        </div>

        <div className="space-y-1">
          <p className="text-gray-400 text-sm">Email</p>
          <p className="font-medium">{data.ownerEmail}</p>
        </div>

        <div className="space-y-1">
          <p className="text-gray-400 text-sm">Phone</p>
          <p className="font-medium">{data.ownerPhone}</p>
        </div>

        <div className="space-y-1">
          <p className="text-gray-400 text-sm">Issue Date</p>
          <p className="font-medium">
            {new Date(data.dateOfIssue).toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-gray-400 text-sm">Expiration Date</p>
          <p className="font-medium">
            {new Date(data.expirationDate).toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-gray-400 text-sm">Alert Sent At</p>
          <p className="font-medium">
            {data.alertSentAt
              ? new Date(data.alertSentAt).toLocaleString()
              : "Never"}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-gray-400 text-sm">Police Notified At</p>
          <p className="font-medium">
            {data.policeNotifiedAt
              ? new Date(data.policeNotifiedAt).toLocaleString()
              : "Never"}
          </p>
        </div>
      </div>

      {data.notes && (
        <div className="space-y-1">
          <p className="text-gray-400 text-sm">Notes</p>
          <p className="font-medium">{data.notes}</p>
        </div>
      )}

      {data.status === "active" && (
        <div className="pt-4 border-t border-gray-700">
          <Button
            onClick={handleMarkReported}
            className="w-full"
            variant="danger"
          >
            Mark as Reported
          </Button>
        </div>
      )}
    </div>
  );
}
