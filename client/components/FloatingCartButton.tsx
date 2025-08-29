import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function FloatingCartButton() {
  const [count, setCount] = useState<number>(0);
  const location = useLocation();

  // Only show on item selection pages
  const shouldShow = location.pathname.startsWith('/order/items/');

  const computeCount = () => {
    try {
      const raw = localStorage.getItem("eazzy-cart");
      if (!raw) return 0;
      const items = JSON.parse(raw) as Array<{ quantity?: number }>;
      return items.reduce((t, i) => t + Number(i?.quantity || 0), 0);
    } catch {
      return 0;
    }
    return cat?.icon || cat?.icon_name || "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop";
  };

  useEffect(() => {
    if (!shouldShow) return; // keep hooks order stable; no listeners if hidden

    setCount(computeCount());
    const onStorage = (e: StorageEvent) => {
      if (e.key === "eazzy-cart") setCount(computeCount());
    };
    const onCartUpdated = () => setCount(computeCount());
    const onFocus = () => setCount(computeCount());
    window.addEventListener("storage", onStorage);
    window.addEventListener("cart:updated", onCartUpdated as EventListener);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cart:updated", onCartUpdated as EventListener);
      window.removeEventListener("focus", onFocus);
    };
  }, [shouldShow]);

  if (!shouldShow) return null;

  return (
    <div
      className="fixed md:hidden z-50"
      style={{ right: 16, bottom: "calc(env(safe-area-inset-bottom, 0px) + 84px)" }}
      aria-label="Open cart"
    >
      <Link
        to="/cart"
        className="relative inline-flex items-center justify-center rounded-full bg-primary text-white shadow-lg w-14 h-14 active:scale-95 transition-transform"
      >
        <CartIcon />
        <span className="sr-only">Cart</span>
        <span
          className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 rounded-full bg-red-500 text-white text-[11px] font-semibold flex items-center justify-center"
          aria-label={`Cart items: ${count}`}
        >
          {count}
        </span>
      </Link>
    </div>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 18C7.55228 18 8 17.5523 8 17C8 16.4477 7.55228 16 7 16C6.44772 16 6 16.4477 6 17C6 17.5523 6.44772 18 7 18Z" fill="currentColor"/>
      <path d="M17 18C17.5523 18 18 17.5523 18 17C18 16.4477 17.5523 16 17 16C16.4477 16 16 16.4477 16 17C16 17.5523 16.4477 18 17 18Z" fill="currentColor"/>
      <path d="M7 16H17C17.7956 16 18.5587 15.6839 19.1213 15.1213C19.6839 14.5587 20 13.7956 20 13V7H5.21L4.27 4H2V6H3.38L6 12.59L5.24 14.04C5.08669 14.3379 5.01023 14.6702 5.01866 15.0053C5.02708 15.3405 5.12008 15.6676 5.28985 15.9568C5.45963 16.246 5.70009 16.4881 5.98764 16.6621C6.27519 16.8361 6.60011 16.9361 6.935 16.954L7 16.9571V16Z" fill="currentColor"/>
    </svg>
  );
}


