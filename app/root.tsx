import { useState, useRef, useEffect } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [projDropdownOpen, setProjDropdownOpen] = useState(false);
  const orgRef = useRef<HTMLDivElement>(null);
  const projRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        orgRef.current && !orgRef.current.contains(event.target as Node)
      ) {
        setOrgDropdownOpen(false);
      }
      if (
        projRef.current && !projRef.current.contains(event.target as Node)
      ) {
        setProjDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
          <Link to="/" className="text-[#e879f9] font-bold text-xl transition transform hover:scale-110">Neuron</Link>

          {/* Organization Dropdown */}
          <div className="relative" ref={orgRef}>
            <button
              onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
              className="text-blue-100 hover:text-[#e879f9] focus:outline-none"
            >
              Your Organization ▼
            </button>
            {orgDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10">
                <Link to="/org/file1" className="block px-4 py-2 text-white hover:bg-gray-600">Goprime Technologies</Link>
                <Link to="/org/file2" className="block px-4 py-2 text-white hover:bg-gray-600">Nomadule</Link>
                <Link to="/org/file3" className="block px-4 py-2 text-white hover:bg-gray-600">Ai Chat Assistant</Link>
              </div>
            )}
          </div>

          {/* Project Dropdown */}
          <div className="relative" ref={projRef}>
            <button
              onClick={() => setProjDropdownOpen(!projDropdownOpen)}
              className="text-blue-100 hover:text-[#e879f9] focus:outline-none"
            >
              Your Project ▼
            </button>
            {projDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10">
                <Link to="/project/file1" className="block px-4 py-2 text-white hover:bg-gray-600">CRM project</Link>
                <Link to="/project/file2" className="block px-4 py-2 text-white hover:bg-gray-600">Neuron</Link>
                <Link to="/project/file3" className="block px-4 py-2 text-white hover:bg-gray-600">Booking app</Link>
              </div>
            )}
          </div>

          <div className="space-x-4">
            <Link to="/chat" className="text-blue-300 hover:text-[#e879f9]">Home</Link>
            <Link to="/sheets" className="text-blue-300 hover:text-[#e879f9]">WorkSheets</Link>
            

          </div>
        </nav>

        <main className="p-4">
          {children}
        </main>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

