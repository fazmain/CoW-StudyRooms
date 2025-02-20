"use client";

import { useState, useEffect } from "react";
import { updateRoomStatus } from "@/app/actions";
import { useToast } from "@/components/ui/use-toast";

interface RoomStatusProps {
  roomName: string;
  initialStatus: boolean;
  onStatusChange: (isOccupied: boolean) => void;
}

export default function RoomStatus({
  roomName,
  initialStatus,
  onStatusChange,
}: RoomStatusProps) {
  const [isOccupied, setIsOccupied] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsOccupied(initialStatus);
  }, [initialStatus]);

  const toggleStatus = async () => {
    setIsUpdating(true);
    const newStatus = !isOccupied;
    try {
      const result = await updateRoomStatus(roomName, newStatus);
      if (result.success) {
        setIsOccupied(newStatus);
        onStatusChange(newStatus);
        toast({
          title: "Status Updated",
          description: `${roomName} is now ${
            newStatus ? "Occupied" : "Available"
          }`,
        });
      } else {
        throw new Error(result.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast({
        title: "Error",
        description: "Failed to update room status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={toggleStatus}
      disabled={isUpdating}
      className={`w-full p-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 bg-stone-100/50 hover:bg-stone-200/50 font-semibold flex justify-between items-center ${
        isOccupied
          ? "text-rose-700"
          : "text-lime-700"
      }`}
    >
      <span>{roomName}</span>
      <span className="text-sm">
        {isUpdating ? "Updating..." : isOccupied ? "Occupied" : "Available"}
      </span>
    </button>
  );
}
