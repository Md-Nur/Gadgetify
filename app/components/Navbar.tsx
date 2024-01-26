"use client";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/images/logo.png";
import { FaUser } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { useCartContext } from "../context/cartContext";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { cartStatus } = useCartContext();
  const [totalProduct, setTotalProduct] = useState<number>();
  const [totalPrice, setTotalPrice] = useState<number>();
  useEffect(() => {
    let price = 0;
    let p = 0;
    cartStatus.forEach((cart) => {
      p += cart?.productQuantity;
      price += cart?.productPrice * cart?.productQuantity;
    });
    setTotalProduct(p);
    setTotalPrice(price);
  }, [cartStatus]);
  return (
    <nav className="navbar sticky top-0 glass z-20">
      <div className="flex-1">
        <label
          htmlFor="my-drawer"
          className="flex btn btn-square btn-ghost md:hidden justify-center items-center"
        >
          <GiHamburgerMenu className="inline-block w-5 h-5 stroke-current" />
        </label>
        <Link href="/" className="btn btn-ghost text-xl">
          <Image src={Logo} alt="Logo" width={50} height={50} />
          <span className="hidden md:block">Gadgetify</span>
        </Link>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control hidden md:flex md:items-center md:gap-2 md:flex-row">
          <input
            type="checkbox"
            value="synthwave"
            className="toggle theme-controller"
          />
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
        </div>

        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <FaCartShopping className="h-5 w-5" />
              <span className="badge badge-sm indicator-item">
                {totalProduct}
              </span>
            </div>
          </div>
          <div
            tabIndex={0}
            className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
          >
            <div className="card-body">
              <span className="font-bold text-lg">{totalProduct} Items</span>
              <span className="text-info">Subtotal: Tk.{totalPrice}</span>
              <div className="card-actions">
                <Link href="/cart" className="btn btn-primary btn-block">
                  View cart
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="">
              <FaUser />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
