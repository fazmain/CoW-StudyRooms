"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import BuildingRooms from "@/components/building-rooms";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <div className="text-gray-800 text-2xl">Loading map...</div>
    </div>
  ),
});

export default function Home() {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

  const handleBuildingSelect = (buildingName: string) => {
    setSelectedBuilding(buildingName);
  };

  return (
    <main className="h-screen relative flex flex-col">
      <div className="flex-grow relative">
        <SiteHeader />
        <Map onBuildingSelect={handleBuildingSelect} />
        {selectedBuilding && (
          <BuildingRooms
            buildingName={selectedBuilding}
            onClose={() => setSelectedBuilding(null)}
          />
        )}
      </div>
      <div className="relative z-50">
        <SiteFooter />
      </div>
    </main>
  );
}
