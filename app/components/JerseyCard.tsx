import React from "react";
import Image from "next/image";

interface JerseyCardProps {
  team: string;
  season: string;
  image: string;
  player?: string;
  number?: string;
  size: string;
  condition: string;
  notes?: string;
}

function JerseyCard({
  team,
  season,
  image,
  player,
  number,
  size,
  condition,
  notes,
}: JerseyCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition bg-white">
      <div className="relative h-64 w-full">
        <Image
          src={image}
          alt={`${team} ${season}`}
          fill
          className="object-cover
        "
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg">{team}</h3>
        <p className="text-gray-600 text-sm">{season}</p>
        {player && (
          <p className="text-sm mt-1">
            {player} {number && `#${number}`}
          </p>
        )}
        <div className="mt-3 flex gap-2 flex-wrap">
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
            {size}
          </span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
            {condition}
          </span>
        </div>
        {notes && (
          <p className="text-gray-500 text-sm mt-2 line-clamp-2">{notes}</p>
        )}
      </div>
    </div>
  );
}

export default JerseyCard;
