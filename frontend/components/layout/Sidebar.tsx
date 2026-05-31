"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    {
      href: "/dashboard",
      label: "Dashboard",
    },

    {
      href: "/dashboard/extinguishers",
      label: "Extinguishers",
    },
  ];

  return (
    <aside
      className="
      w-64
      bg-gray-900
      min-h-screen
      p-6
    "
    >
      <h1 className="text-2xl font-bold mb-8">Company XYZ</h1>

      <nav className="space-y-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`
              block rounded-lg px-4 py-3
              ${pathname === link.href ? "bg-blue-600" : "hover:bg-gray-800"}
            `}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
