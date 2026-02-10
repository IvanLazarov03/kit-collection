"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function JerseyForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    team: "",
    season: "",
    player: "",
    number: "",
    size: "",
    condition: "",
    notes: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await fetch("/api/jerseys", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        router.push("/collection");
      } else {
        alert("Failed to add jersey");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding jersey");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" py-20 ">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Jersey Photo *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-black file:text-white
            hover:file:bg-gray-800
            file:cursor-pointer cursor-pointer"
            required
          />
          {imagePreview && (
            <div className="mt-4 relative h-64 w-full border rounded-lg overflow-hidden">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* Team */}
        <div>
          <label className="block text-sm font-medium mb-2">Team/Club *</label>
          <input
            type="text"
            value={formData.team}
            onChange={(e) => setFormData({ ...formData, team: e.target.value })}
            placeholder="e.g., Chelsea, Real Madrid"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            required
          />
        </div>

        {/* Season */}
        <div>
          <label className="block text-sm font-medium mb-2">Season *</label>
          <input
            type="text"
            value={formData.season}
            onChange={(e) =>
              setFormData({ ...formData, season: e.target.value })
            }
            placeholder="e.g., 2022-2023, 2021/22"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            required
          />
        </div>

        {/* Player Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Player Name (Optional)
          </label>
          <input
            type="text"
            value={formData.player}
            onChange={(e) =>
              setFormData({ ...formData, player: e.target.value })
            }
            placeholder="e.g., Messi, Ronaldo"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          />
        </div>

        {/* Number */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Number (Optional)
          </label>
          <input
            type="text"
            value={formData.number}
            onChange={(e) =>
              setFormData({ ...formData, number: e.target.value })
            }
            placeholder="e.g., 10, 7"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          />
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-medium mb-2">Size *</label>
          <select
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            required
          >
            <option value="">Select size</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium mb-2">Condition *</label>
          <select
            value={formData.condition}
            onChange={(e) =>
              setFormData({ ...formData, condition: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            required
          >
            <option value="">Select condition</option>
            <option value="New">New</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="Any additional information..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-none"
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Adding Jersey..." : "Add Jersey"}
        </button>
      </form>
    </div>
  );
}
