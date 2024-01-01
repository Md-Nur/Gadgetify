import Link from "next/link";
import React from "react";

const Drawer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* page content */}
        {children}
      </div>
      <div className="drawer-side z-10">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-60 sm:w-80 min-h-full bg-base-200 text-base-content space-y-5">
          {/* Sidebar content here */}
          <li className="">
            <Link href="/" className="btn btn-ghost text-xl">
              <span className="">Gadgetify</span>
            </Link>
          </li>
          <li className="">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-full"
            />
          </li>
          
        </ul>
      </div>
    </div>
  );
};

export default Drawer;
