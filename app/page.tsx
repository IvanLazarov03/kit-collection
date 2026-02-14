"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import Header from "./components/Navbar";

const jerseys = [
  {
    id: 1,
    image: "/chelsea.jpg",
    alt: "Chelsea third kit 2022-2023",
  },
  {
    id: 2,
    image: "/real madrid.jpg",
    alt: "Barcelona 2015 Messi #10",
  },
  {
    id: 3,
    image: "/argentina.jpg",
    alt: "Brazil 2002 Ronaldo #9",
  },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % jerseys.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col">
        {/* Hero Section */}
        <div
          className="relative h-screen w-full overflow-hidden bg-black"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {jerseys.map((jersey, index) => (
            <div
              key={jersey.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={jersey.image}
                alt={jersey.alt}
                fill
                sizes="100vw"
                className="object-cover"
                priority={index === 0}
                quality={75}
              />
            </div>
          ))}

          {/* Dark overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/30 z-10" />

          {/* Title */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <h1 className="text-5xl md:text-6xl font-bold text-white text-center px-4">
              My Football Shirt Collection
            </h1>
          </div>

          {/* Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {jerseys.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
