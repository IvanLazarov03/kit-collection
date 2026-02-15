"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // ← Changed from "next/router"

interface JerseyCardProps {
  id: string;
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
  id,
  team,
  season,
  image,
  player,
  number,
  size,
  condition,
  notes,
}: JerseyCardProps) {
  const [isDeleting, setIsDeleting] = useState(false); // ← Better naming
  const router = useRouter();

  async function handleDelete() {
    if (
      !confirm(
        `Are you sure you want to delete jersey from ${team} ${season} season?`,
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/jerseys/${id}`, {
        method: "DELETE",
      }); // ← Added leading slash

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete jersey");
      }

      // Success - refresh the page
      router.refresh(); // ← Changed from router.reload()
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Failed to delete kit, please try again");
      setIsDeleting(false);
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition bg-white relative group">
      {/* Delete button - shows on hover */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        title="Delete jersey"
      >
        {isDeleting ? "⏳" : "🗑️"}
      </button>

      <div className="relative h-64 w-full">
        <Image
          src={image}
          alt={`${team} ${season}`}
          fill
          loading="eager"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-black font-bold text-lg">{team}</h3>
        <p className="text-black! text-sm">{season}</p>
        {player && (
          <p className="text-black! text-sm mt-1">
            {player} {number && `#${number}`}
          </p>
        )}
        <div className="mt-3 flex gap-2 flex-wrap">
          <span className="bg-gray-100 text-black! px-3 py-1 rounded-full text-xs">
            {size}
          </span>
          <span className="bg-gray-100 text-black! px-3 py-1 rounded-full text-xs">
            {condition}
          </span>
        </div>
        {notes && (
          <p className="text-black! text-sm mt-2 line-clamp-2">{notes}</p>
        )}
      </div>
    </div>
  );
}

export default JerseyCard;
