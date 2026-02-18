"use client";
import Link from "next/link";
import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useUserAuth } from "../context/userContext";

const Drawer = ({ children }: { children: React.ReactNode }) => {
  const { userAuth } = useUserAuth();

  const categories = [
    "Power Banks",
    "Cables & Adapters",
    "Cases & Covers",
    "Smartwatches",
    "Audio",
    "Accessories",
    "Gaming",
    "Others",
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = (e.target as any).search.value;
    if (query?.trim()) {
      window.location.href = `/products?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content min-h-screen flex flex-col">
        {/* page content */}
        {children}
      </div>
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-72 min-h-full bg-base-100 text-base-content space-y-2">
          {/* Sidebar content here */}
          <li className="py-2"></li>

          <li>
            <Link href="/" className="flex items-center gap-2 px-4 py-4 hover:bg-base-200 rounded-xl transition-all group mb-2">
              <span className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:opacity-80 tracking-tighter">
                Gadgetify
              </span>
            </Link>
          </li>

          <li>
            <form onSubmit={handleSearch} className="px-4 py-2 mt-2">
              <div className="relative w-full group">
                <input
                  type="text"
                  name="search"
                  placeholder="Search gadgets..."
                  className="input input-bordered input-md w-full rounded-xl pl-10 focus:input-primary transition-all bg-base-200/50"
                  required
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 opacity-40 group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
          </li>

          <li><div className="divider my-0 opacity-50"></div></li>

          {/* Categories Section */}
          <li className="menu-title px-4 py-3 text-sm font-bold uppercase tracking-wider text-base-content/50">
            Categories
          </li>
          {categories.map((cat) => (
            <li key={cat}>
              <Link
                href={`/products?category=${cat}`}
                className="px-4 py-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-all"
                onClick={() => {
                  const drawer = document.getElementById("my-drawer") as HTMLInputElement;
                  if (drawer) drawer.checked = false;
                }}
              >
                {cat}
              </Link>
            </li>
          ))}

          <li><div className="divider my-2 opacity-50"></div></li>

          {/* Theme Mode */}
          <li>
            <div className="flex items-center justify-between px-4 py-2 hover:bg-transparent">
              <span className="font-medium text-base-content/70 flex items-center gap-2">
                <FaSun className="w-4 h-4 text-warning" /> Theme Mode
              </span>
              <input
                type="checkbox"
                className="toggle theme-controller toggle-md"
                value="dark"
              />
            </div>
          </li>

          {userAuth.isAdmin && (
            <>
              <li><div className="divider my-2 opacity-50"></div></li>
              <li>
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-all font-bold"
                  onClick={() => {
                    const drawer = document.getElementById("my-drawer") as HTMLInputElement;
                    if (drawer) drawer.checked = false;
                  }}
                >
                  Admin Dashboard
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Drawer;
