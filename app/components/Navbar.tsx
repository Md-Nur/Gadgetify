"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Logo from "../../public/images/logo.png";
import { FaUser, FaThList } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { useCartContext } from "../context/cartContext";
import { useUserAuth } from "../context/userContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";

const Navbar = () => {
  const { cartStatus, loading: cartLoading } = useCartContext();
  const { userAuth } = useUserAuth();
  const [totalProduct, setTotalProduct] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  // Close dropdowns on route change
  useEffect(() => {
    const elem = document.activeElement as HTMLElement;
    if (elem) {
      elem.blur();
    }
  }, [pathname]);

  useEffect(() => {
    let price = 0;
    let p = 0;
    cartStatus.forEach((cart) => {
      p += cart?.productQuantity || 0;
      price += (cart?.productPrice || 0) * (cart?.productQuantity || 0);
    });
    setTotalProduct(p);
    setTotalPrice(price);
  }, [cartStatus]);

  return (
    <nav className="navbar sticky top-0 glass z-50 px-4 md:px-8 shadow-md border-b border-primary/10 flex-nowrap min-h-[72px] transition-all duration-300">
      <div className="flex-1 flex items-center min-w-0 shrink-0">
        <label
          htmlFor="my-drawer"
          className="btn btn-square btn-ghost lg:hidden mr-1 md:mr-2 shrink-0 hover:bg-primary/10"
          aria-label="Open drawer"
        >
          <GiHamburgerMenu className="w-6 h-6" />
        </label>
        <Link href="/" className="flex items-center gap-2 md:gap-3 hover:opacity-90 transition-all ml-1 shrink-0 overflow-hidden group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
            <Image
              src={Logo}
              alt="Gadgetify Logo"
              width={40}
              height={40}
              className="relative w-8 h-8 md:w-11 md:h-11 shrink-0 drop-shadow-sm"
              sizes="(max-width: 768px) 32px, 44px"
            />
          </div>
          <span className="text-xl md:text-3xl font-extrabold tracking-tighter text-gradient whitespace-nowrap hidden sm:block">
            Gadgetify
          </span>
        </Link>
      </div>

      <div className="flex-none hidden lg:flex items-center gap-6 mx-4">
        <div className="dropdown dropdown-hover">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-2 font-semibold hover:bg-primary/10 transition-all rounded-full px-4">
            Categories
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50 group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <ul tabIndex={0} className="dropdown-content z-[2] menu p-3 shadow-2xl bg-base-100/95 backdrop-blur-lg rounded-2xl w-56 border border-primary/10 animate-in fade-in zoom-in duration-200">
            {[
              "Power Banks",
              "Cables & Adapters",
              "Cases & Covers",
              "Smartwatches",
              "Audio",
              "Accessories",
              "Gaming",
              "Others",
            ].map((cat) => (
              <li key={cat}>
                <Link
                  href={`/products?category=${cat}`}
                  className="hover:bg-primary/10 hover:text-primary transition-all py-2 rounded-lg"
                  onClick={() => (document.activeElement as HTMLElement)?.blur()}
                >
                  {cat}
                </Link>
              </li>
            ))}
            <li><div className="divider my-1 opacity-50"></div></li>
            <li>
              <Link
                href="/products"
                className="font-bold text-secondary hover:bg-secondary/10 py-2 rounded-lg"
                onClick={() => (document.activeElement as HTMLElement)?.blur()}
              >
                All Products
              </Link>
            </li>
          </ul>
        </div>

        <Link href="/products" className="text-sm font-bold hover:text-primary transition-colors">
          New Arrivals
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative group w-64 lg:w-80">
          <input
            type="text"
            placeholder="Search gadgets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm input-bordered w-full rounded-full pl-10 bg-base-100/50 focus:bg-base-100 focus:input-primary border-primary/10 group-hover:border-primary/30 transition-all font-medium"
          />
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30 group-focus-within:text-primary transition-colors" />
        </form>
      </div>

      <div className="flex-none flex items-center gap-2 md:gap-4 flex-nowrap shrink-0">
        {/* Cart Dropdown */}
        <div className="dropdown dropdown-end shrink-0 dropdown-hover">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm md:btn-md hover:bg-primary/10 transition-colors">
            <div className="indicator">
              <FaCartShopping className="w-5 h-5 md:w-6 md:h-6 text-base-content/80" />
              {totalProduct > 0 && (
                <span className="badge badge-xs md:badge-sm badge-primary indicator-item border-none shadow-sm animate-bounce">
                  {totalProduct}
                </span>
              )}
            </div>
          </div>
          <div
            tabIndex={0}
            className="z-[1] card card-compact dropdown-content w-72 bg-base-100/95 backdrop-blur-lg shadow-2xl border border-primary/10 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="card-body p-6">
              {cartLoading ? (
                <div className="flex justify-center py-4">
                  <span className="loading loading-spinner text-primary"></span>
                </div>
              ) : totalProduct > 0 ? (
                <>
                  <h3 className="font-extrabold text-xl mb-1">{totalProduct} items in cart</h3>
                  <p className="text-base-content/60 text-base mb-4">
                    Subtotal: <span className="text-primary font-bold">Tk. {totalPrice}</span>
                  </p>
                  <div className="card-actions">
                    <Link href="/cart" className="btn btn-primary btn-block shadow-lg hover:shadow-primary/30 rounded-xl transition-all">
                      View Cart & Checkout
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-pretty">
                  <p className="font-bold text-base-content/40 mb-3">Your cart is empty</p>
                  <Link href="/" className="btn btn-primary btn-sm btn-block rounded-lg">
                    Shop Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Dropdown */}
        <div className="dropdown dropdown-end shrink-0 dropdown-hover">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle btn-sm md:btn-md hover:bg-primary/10 transition-colors"
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden flex items-center justify-center bg-base-200 ring-2 ring-primary/10 hover:ring-primary/40 transition-all p-0.5">
              {userAuth.images ? (
                <Image src={userAuth.images} alt="Profile" width={32} height={32} className="object-cover rounded-full" />
              ) : (
                <FaUser className="text-base-content/50 w-4 h-4 md:w-5 md:h-5" />
              )}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="z-[1] p-3 shadow-2xl menu menu-sm dropdown-content bg-base-100/95 backdrop-blur-lg rounded-2xl w-60 border border-primary/10 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            {userAuth.id ? (
              <>
                <li className="menu-title px-4 py-3 text-xs uppercase tracking-widest opacity-40 font-bold">Account Overview</li>
                <li>
                  <Link href="/user/profile" className="py-2.5 rounded-lg hover:bg-primary/10">My Profile</Link>
                </li>
                {userAuth.isAdmin && (
                  <li>
                    <Link href="/admin" className="text-primary font-bold py-2.5 rounded-lg hover:bg-primary/10">
                      <FaThList className="inline-block mr-2" /> Admin Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <Link href={`/user/update/${userAuth.id}`} className="py-2.5 rounded-lg hover:bg-primary/10">Account Settings</Link>
                </li>
                <li>
                  <Link href="/track-order" className="py-2.5 rounded-lg hover:bg-primary/10 group flex items-center justify-between">
                    Track Order
                    <span className="badge badge-primary badge-xs badge-outline group-hover:bg-primary group-hover:text-white transition-colors">New</span>
                  </Link>
                </li>
                <li><div className="divider my-1 opacity-50"></div></li>
                <li>
                  <button onClick={() => {
                    fetch("/api/users/logout")
                      .then((res) => res.json())
                      .then((data) => {
                        if (data.success) {
                          window.location.href = "/user/login";
                        }
                      });
                  }} className="text-error font-bold py-2.5 rounded-lg hover:bg-error/10">Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/user/login" className="font-bold text-primary py-3 rounded-xl hover:bg-primary/10 text-center block mb-2">Login</Link>
                </li>
                <li>
                  <Link href="/user/signin" className="btn btn-outline btn-primary btn-sm rounded-xl py-2">Create Account</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>

  );
};

export default Navbar;
