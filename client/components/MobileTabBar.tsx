import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function MobileTabBar() {
  const location = useLocation();

  type IconRenderer = (props: { active: boolean }) => JSX.Element;
  const items: Array<{ to: string; label: string; icon: IconRenderer }> = [
    { to: "/", label: "Home", icon: HomeIcon },
    { to: "/services", label: "Services", icon: ServicesIcon },
    { to: "/orders", label: "Orders", icon: OrdersIcon },
    { to: "/help", label: "Help", icon: HelpIcon },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 md:hidden"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 6px)" }}
      aria-label="Primary"
    >
      <div className="mx-3 rounded-2xl border border-gray-200 bg-white/95 backdrop-blur px-3 py-2 shadow-lg">
        <ul className="grid grid-cols-4 gap-1">
          {items.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
            return (
              <li key={to}>
                <Link
                  to={to}
                  className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl active:bg-gray-100 touch-target"
                  aria-current={active ? "page" : undefined}
                >
                  <Icon active={active} />
                  <span className={`text-[11px] ${active ? "text-primary font-medium" : "text-gray-600"}`}>
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 10L12 3L21 10V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10Z" stroke={active ? "#2675f5" : "#111"} strokeWidth="2"/>
      <path d="M9 21V12H15V21" stroke={active ? "#2675f5" : "#111"} strokeWidth="2"/>
    </svg>
  );
}

function ServicesIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="14" rx="2" stroke={active ? "#2675f5" : "#111"} strokeWidth="2"/>
      <path d="M7 8H17M7 12H13" stroke={active ? "#2675f5" : "#111"} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function OrdersIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke={active ? "#2675f5" : "#111"} strokeWidth="2"/>
      <path d="M7 8H17M7 12H12M7 16H10" stroke={active ? "#2675f5" : "#111"} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function HelpIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke={active ? "#2675f5" : "#111"} strokeWidth="2"/>
      <path d="M12 17H12.01M9.09 9a3 3 0 0 1 5.83 1c0 2-3 2-3 4" stroke={active ? "#2675f5" : "#111"} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}


