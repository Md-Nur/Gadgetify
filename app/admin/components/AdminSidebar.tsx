"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  FaBox,
  FaClipboardList,
  FaHome,
  FaSignOutAlt,
  FaUsers,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      name: "ড্যাশবোর্ড",
      href: "/admin",
      icon: <FaHome className="w-5 h-5" />,
    },
    {
      name: "পণ্য ব্যবস্থাপনা",
      href: "/admin/add-product",
      icon: <FaBox className="w-5 h-5" />,
    },
    {
      name: "অর্ডার ব্যবস্থাপনা",
      href: "/admin/orders",
      icon: <FaClipboardList className="w-5 h-5" />,
    },
    {
      name: "ব্যবহারকারী ব্যবস্থাপনা",
      href: "/admin/users",
      icon: <FaUsers className="w-5 h-5" />,
    },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/users/logout");
      if (res.ok) {
        toast.success("সফলভাবে লগ আউট হয়েছে");
        router.push("/user/login");
        router.refresh();
      } else {
        toast.error("লগ আউট করতে সমস্যা হয়েছে");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("কিছু ভুল হয়েছে");
    }
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-primary-content rounded-lg shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-base-200 border-r border-base-300 w-64 z-45 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              <span className="text-gradient">Gadgetify</span> Admin
            </h1>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-primary text-primary-content shadow-md"
                      : "hover:bg-base-300 text-base-content/80"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-error hover:bg-error/10 transition-all font-medium"
            >
              <FaSignOutAlt className="w-5 h-5" />
              <span>লগ আউট</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
