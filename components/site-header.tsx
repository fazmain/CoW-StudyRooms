"use client";

interface SiteHeaderProps {
  className?: string;
}

export default function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-[10%] md:left-8 md:translate-x-0 md:top-32 -translate-y-1/2 z-50">
      <div className="bg-yellow-400/70 backdrop-blur-sm rounded-lg shadow-sm px-6 py-4 w-[90vw] md:max-w-sm">
        <div className="space-y-2">
          <h1 className="text-lg font-medium text-gray-900">
            CoW Study Room Finder
          </h1>
          <p className="text-sm text-gray-800">
            Select a building marker to check room availability. Help others by
            marking rooms as occupied when you're using them.
          </p>
        </div>
      </div>
    </div>
  );
}
