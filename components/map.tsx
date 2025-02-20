"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import "./map.css";

const buildings = [
  { name: "Kauke Hall", position: [40.810952, -81.936095] },
  { name: "Taylor Hall", position: [40.810334, -81.937716] },
  { name: "Severance Hall", position: [40.809563, -81.935848] },
  { name: "Lowry Centre", position: [40.811064, -81.933672] },
  { name: "Andrews Library", position: [40.810748, -81.934831] },
  { name: "Timken Library", position: [40.810277, -81.935422] },
  // Add more buildings as needed
];

interface MapProps {
  onBuildingSelect: (buildingName: string) => void;
}

function BuildingButtons({
  onBuildingSelect,
}: {
  onBuildingSelect: (buildingName: string) => void;
}) {
  const map = useMap();

  useEffect(() => {
    buildings.forEach((building) => {
      // Create a custom marker icon
      const icon = L.icon({
        iconUrl: "/marker-icon.png",
        iconSize: [45, 45],
        iconAnchor: [22, 22], // Centered anchor point
        popupAnchor: [0, -25], // Popup appears above the marker
      });

      // Create marker with the custom icon
      const marker = L.marker(building.position as L.LatLngExpression, { icon })
        .addTo(map)
        .bindPopup(building.name, {
          className: "custom-popup",
          closeButton: false,
          autoPan: true,
          maxWidth: 200,
        }); // Add a popup with building name

      // Add click handler
      marker.on("click", () => {
        onBuildingSelect(building.name);
      });
    });
  }, [map, onBuildingSelect]);

  return null;
}

export default function Map({ onBuildingSelect }: MapProps) {
  return (
    <div className="absolute inset-0 z-0">
      <MapContainer
        center={[40.809766, -81.936063] as L.LatLngExpression}
        zoom={20}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url={`https://{s}.tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png?apikey=${process.env.NEXT_PUBLIC_THUNDERFOREST_API_KEY}`}
          attribution='&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <BuildingButtons onBuildingSelect={onBuildingSelect} />
      </MapContainer>
    </div>
  );
}
