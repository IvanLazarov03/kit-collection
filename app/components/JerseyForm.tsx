"use client";

import { useState, useRef, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  // Handle paste event (works on both mobile and desktop)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Only handle paste if we're on the form
      if (!formRef.current?.contains(e.target as Node)) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        // Handle pasted image file
        if (item.type.indexOf("image") !== -1) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            handleImageFile(file);
          }
          return;
        }
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, []);

  // Handle file selection
  const handleImageFile = (file: File) => {
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  // Clear image
  const clearImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
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

      // Add other form data
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
        const error = await response.json();
        alert(error.error || "Failed to add jersey");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding jersey");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-20" ref={formRef}>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Jersey Photo *
          </label>

          {!imagePreview ? (
            <div className="space-y-3">
              {isMobile ? (
                // Mobile: Show Gallery and Camera buttons
                <>
                  {/* Gallery Button */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="block w-full text-center px-4 py-3 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800 transition"
                    >
                      📁 Choose from Gallery
                    </label>
                  </div>

                  {/* Camera Button */}
                  <div>
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageChange}
                      className="hidden"
                      id="camera-upload"
                    />
                    <label
                      htmlFor="camera-upload"
                      className="block w-full text-center px-4 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition"
                    >
                      📷 Take Photo
                    </label>
                  </div>
                </>
              ) : (
                // Desktop: Show single file upload button
                <div>
                  <input
                    ref={fileInputRef}
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
                  />
                </div>
              )}

              {/* Paste Hint */}
              {!isMobile ? (
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Or paste an image directly (Ctrl/Cmd + V)
                  </p>
                </div>
              ) : (
                <></>
              )}
            </div>
          ) : (
            /* Image Preview */
            <div className="space-y-3">
              <div className="relative h-64 w-full border-2 border-gray-200 rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={clearImage}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  ✕ Remove
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (isMobile) {
                      fileInputRef.current?.click();
                    } else {
                      fileInputRef.current?.click();
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  🔄 Change
                </button>
              </div>
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
          disabled={isSubmitting || !imagePreview}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Adding Jersey..." : "Add Jersey"}
        </button>
      </form>
    </div>
  );
}
