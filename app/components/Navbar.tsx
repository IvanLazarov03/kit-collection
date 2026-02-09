import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white">
          Jersey Collection
        </Link>

        <ul className="flex gap-8 text-white">
          <li>
            <Link href="/" className="hover:text-gray-300 transition">
              Home
            </Link>
          </li>
          <li>
            <Link href="/collection" className="hover:text-gray-300 transition">
              Collection
            </Link>
          </li>
          <li>
            <Link href="/add" className="hover:text-gray-300 transition">
              Add Jersey
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
