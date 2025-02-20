"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import RoomStatus from "./room-status";
import { getRoomStates, updateRoomState } from "@/app/actions";
import { useToast } from "@/components/ui/use-toast";

interface Floor {
  name: string;
  rooms: string[];
}

interface BuildingStructure {
  [key: string]: Floor[];
}

const buildingStructure: BuildingStructure = {
  "Kauke Hall": [
    {
      name: "First Floor",
      rooms: ["101", "102", "103", "104"],
    },
    {
      name: "Second Floor",
      rooms: ["201", "202", "203", "204"],
    },
    {
      name: "Third Floor",
      rooms: ["301", "302", "303", "304"],
    },
  ],
  "Taylor Hall": [
    {
      name: "Ground Floor",
      rooms: ["G01", "G02", "G03"],
    },
    {
      name: "First Floor",
      rooms: ["101", "102", "103"],
    },
  ],
  "Severance Hall": [
    {
      name: "First Floor",
      rooms: ["101", "102", "103"],
    },
    {
      name: "Second Floor",
      rooms: ["201", "202", "203"],
    },
  ],
  "Lowry Centre": [
    {
      name: "Ground Floor",
      rooms: ["G01", "G02", "G03", "G04"],
    },
    {
      name: "First Floor",
      rooms: ["101", "102", "103", "104"],
    },
    {
      name: "Second Floor",
      rooms: ["201", "202", "203", "204"],
    },
  ],
  "Andrews Library": [
    {
      name: "Level 1",
      rooms: ["L101", "L102", "L103", "L104"],
    },
    {
      name: "Level 2",
      rooms: ["L201", "L202", "L203", "L204"],
    },
    {
      name: "Level 3",
      rooms: ["L301", "L302", "L303", "L304"],
    },
  ],
  "Timken Library": [
    {
      name: "Main Floor",
      rooms: ["M01", "M02", "M03", "M04"],
    },
    {
      name: "Upper Floor",
      rooms: ["U01", "U02", "U03", "U04"],
    },
  ],
};

interface BuildingRoomsProps {
  buildingName: string;
  onClose: () => void;
}

function FloorSection({
  floor,
  buildingName,
  roomStates,
  onStatusChange,
}: {
  floor: Floor;
  buildingName: string;
  roomStates: Record<string, boolean>;
  onStatusChange: (room: string, status: boolean) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="rounded-lg overflow-hidden mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center p-3 bg-yellow-500 hover:bg-yellow-500/80 transition-colors rounded-lg mb-2"
      >
        <span className="font-medium text-black">{floor.name}</span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isExpanded && (
        <div className="p-3 space-y-3 bg-black/10 rounded-lg">
          {floor.rooms.map((roomNumber) => {
            const roomName = `${buildingName} ${roomNumber}`;
            return (
              <RoomStatus
                key={roomName}
                roomName={roomName}
                initialStatus={roomStates[roomName] || false}
                onStatusChange={(isOccupied) =>
                  onStatusChange(roomName, isOccupied)
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function BuildingRooms({
  buildingName,
  onClose,
}: BuildingRoomsProps) {
  const [roomStates, setRoomStates] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRoomStates = async () => {
      setIsLoading(true); // Set loading when starting fetch
      try {
        const states = await getRoomStates();
        setRoomStates(states);
      } catch (error) {
        console.error("Error fetching room states:", error);
        toast({
          title: "Error",
          description: "Failed to fetch room states. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false); // Set loading to false whether successful or not
      }
    };

    fetchRoomStates();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchRoomStates, 30000);

    return () => clearInterval(interval);
  }, [buildingName, toast]); // Add toast back to dependencies

  const handleStatusChange = async (roomName: string, status: boolean) => {
    try {
      await updateRoomState(roomName, status);
      setRoomStates((prev) => ({ ...prev, [roomName]: status }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update room state. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-80 bg-gray-300/20 backdrop-blur-md shadow-lg p-4 overflow-y-auto z-[1000] transition-transform transform translate-x-0 duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-black mt-8 py-5">
          {buildingName}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-800 hover:text-red-500 transition-colors duration-200"
        >
          <X size={24} />
        </button>
      </div>
      {isLoading ? (
        <div className="text-center py-4">Loading room states...</div>
      ) : (
        <div className="space-y-2">
          {buildingStructure[buildingName]?.map((floor) => (
            <FloorSection
              key={floor.name}
              floor={floor}
              buildingName={buildingName}
              roomStates={roomStates}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
