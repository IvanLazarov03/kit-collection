"use client"; // Required for useState
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className={`${isOpen ? "backdrop-blur-2xl " : ""} fixed top-0 left-0 right-0 z-50`}
    >
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between flex-wrap">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white">
          Jersey Collection
        </Link>

        {/* Hamburger Button (Visible only on mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white md:hidden focus:outline-none"
        >
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            {isOpen ? (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 01-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 011.414-1.414l4.829 4.828 4.828-4.828a1 1 0 111.414 1.414l-4.828 4.829 4.828 4.828z"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z"
              />
            )}
          </svg>
        </button>

        {/* Navigation Links */}
        <div
          className={`${isOpen ? "block " : "hidden"} w-full md:flex md:items-center md:w-auto`}
        >
          <ul className="flex flex-col md:flex-row gap-4 md:gap-8 text-white mt-4 md:mt-0">
            <li>
              <Link
                href="/"
                className="hover:text-gray-300 transition block py-2 md:py-0"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/collection"
                className="hover:text-gray-300 transition block py-2 md:py-0"
              >
                Collection
              </Link>
            </li>
            <li>
              <Link
                href="/add"
                className="hover:text-gray-300 transition block py-2 md:py-0"
              >
                Add Jersey
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
