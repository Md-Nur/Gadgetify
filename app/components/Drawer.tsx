import Link from "next/link";
import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";

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
          <li className="py-5"></li>{" "}
          {/* This the the buffer space for navbar fixed */}
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
          <li className="">
            <label className="swap swap-rotate">
              {/* this hidden checkbox controls the state */}
              <input
                type="checkbox"
                className="theme-controller"
                value="synthwave"
              />

              {/* sun icon */}
              <FaSun className="swap-on fill-current" />

              {/* moon icon */}
              <FaMoon className="swap-off fill-current" />
            </label>
          </li>
          <li className="">
            <Link href="/admin" className="btn btn-ghost text-lg">
              <span className="">Admin</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Drawer;
