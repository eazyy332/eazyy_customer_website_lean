import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerClose,
} from "./ui/drawer";

export default function SiteHeader() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => { sub.subscription?.unsubscribe(); };
  }, []);

  return (
    <header className="w-full px-4 md:px-8 py-2">
      <nav className="grid grid-cols-3 items-center max-w-7xl mx-auto">
        {/* Left: Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-xs text-black">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
          <Link to="/about" className="hover:text-primary transition-colors">About</Link>
          <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </div>

        {/* Mobile: Hamburger */}
        <div className="md:hidden flex items-center">
          <MobileMenu />
        </div>

        {/* Center: Logo */}
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0ba0452a2d1340e7b84136d8ed253a1b%2Fb6e642e462f04f14827396626baf4d5e?format=webp&width=320"
              alt="eazyy logo"
              className="h-5 md:h-6 w-auto"
            />
          </Link>
        </div>

        {/* Right: Icons */}
        <div className="hidden md:flex items-center justify-end gap-3">
          <Link to="/help" className="p-1.5 rounded hover:bg-gray-100" title="Help">
            <MenuIcon name="help" />
          </Link>
          <Link to="/orders" className="p-1.5 rounded hover:bg-gray-100" title="Orders">
            <MenuIcon name="orders" />
          </Link>
          <Link to="/cart" className="p-1.5 rounded hover:bg-gray-100" title="Cart">
            <MenuIcon name="cart" />
          </Link>
          {email ? (
            <div className="relative">
              <button 
                className="p-1.5 rounded hover:bg-gray-100 flex items-center gap-2" 
                onClick={() => {
                  const dropdown = document.getElementById('account-dropdown');
                  if (dropdown) {
                    dropdown.classList.toggle('hidden');
                  }
                }}
              >
                <AccountIcon />
                <span className="text-sm text-black">{email}</span>
              </button>
              <div id="account-dropdown" className="absolute right-0 mt-2 w-40 rounded-xl border border-gray-200 bg-white shadow-lg hidden z-50">
                <Link to="/account" className="block px-4 py-2 text-sm hover:bg-gray-50">Account</Link>
                <button 
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.href = '/';
                  }} 
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/account" className="p-1.5 rounded hover:bg-gray-100" title="Account">
              <AccountIcon />
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

function MobileMenu() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          aria-label="Open menu"
          className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200"
        >
          <HamburgerIcon />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Menu</DrawerTitle>
          <DrawerDescription>Navigate through the site</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-6 space-y-1">
          <MobileLink to="/" label="Home" />
          <MobileLink to="/services" label="Services" />
          <MobileLink to="/about" label="About" />
          <MobileLink to="/contact" label="Contact" />
          <MobileLink to="/orders" label="Orders" />
          <MobileLink to="/cart" label="Cart" />
          <MobileLink to="/login" label="Account" />
          <MobileLink to="/help" label="Help" />
          <div className="pt-3">
            <Link
              to="/order/start"
              className="block w-full text-center rounded-full bg-primary text-white px-5 py-3 font-medium"
            >
              Start Order
            </Link>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function MobileLink({ to, label }: { to: string; label: string }) {
  return (
    <DrawerClose asChild>
      <Link
        to={to}
        className="block w-full rounded-xl px-4 py-3 text-base text-black hover:bg-gray-100 active:bg-gray-200"
      >
        {label}
      </Link>
    </DrawerClose>
  );
}

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6H21" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 12H21" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 18H21" stroke="black" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon({ name }: { name: "help" | "orders" | "cart" }) {
  if (name === "help") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.02 2 10.98C2 14.17 3.86 16.94 6.59 18.53L6 22L9.33 19.98C10.18 20.22 11.07 20.36 12 20.36C17.52 20.36 22 16.34 22 11.38C22 6.42 17.52 2 12 2ZM13 17H11V15H13V17ZM13.31 12.9L12.9 13.24V14H11V12.5L12.06 11.59C12.41 11.3 12.6 11.06 12.6 10.7C12.6 10.15 12.15 9.7 11.6 9.7C11.05 9.7 10.6 10.15 10.6 10.7H8.6C8.6 9.04 9.94 7.7 11.6 7.7C13.26 7.7 14.6 9.04 14.6 10.7C14.6 11.57 14.17 12.22 13.31 12.9Z" fill="black"/>
      </svg>
    );
  }
  if (name === "orders") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 6H21V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V6Z" stroke="black" strokeWidth="2"/>
        <path d="M16 3H8L6 6H18L16 3Z" stroke="black" strokeWidth="2"/>
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 18C7.55228 18 8 17.5523 8 17C8 16.4477 7.55228 16 7 16C6.44772 16 6 16.4477 6 17C6 17.5523 6.44772 18 7 18Z" fill="black"/>
      <path d="M17 18C17.5523 18 18 17.5523 18 17C18 16.4477 17.5523 16 17 16C16.4477 16 16 16.4477 16 17C16 17.5523 16.4477 18 17 18Z" fill="black"/>
      <path d="M7 16H17C17.7956 16 18.5587 15.6839 19.1213 15.1213C19.6839 14.5587 20 13.7956 20 13V7H5.21L4.27 4H2V6H3.38L6 12.59L5.24 14.04C5.08669 14.3379 5.01023 14.6702 5.01866 15.0053C5.02708 15.3405 5.12008 15.6676 5.28985 15.9568C5.45963 16.246 5.70009 16.4881 5.98764 16.6621C6.27519 16.8361 6.60011 16.9361 6.935 16.954L7 16.9571V16Z" fill="black"/>
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" stroke="black" strokeWidth="2" />
      <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20" stroke="black" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}


