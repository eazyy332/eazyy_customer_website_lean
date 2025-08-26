import React, { useEffect, useState } from "react";

declare global {
  interface WindowEventMap {
    beforeinstallprompt: any;
  }
}

export default function AddToHomeBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("a2hs-dismissed");
    function handler(e: any) {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!dismissed && window.innerWidth <= 768) setVisible(true);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!visible) return null;

  const onInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    try {
      await deferredPrompt.userChoice;
    } finally {
      sessionStorage.setItem("a2hs-dismissed", "1");
      setVisible(false);
    }
  };

  return (
    <div
      className="fixed bottom-20 left-0 right-0 z-[60] md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-3 rounded-2xl border border-gray-200 bg-white shadow-xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src="/favicon.ico"
            alt="App icon"
            className="w-8 h-8 rounded-lg"
          />
          <div>
            <div className="text-sm font-semibold">Install eazyy</div>
            <div className="text-xs text-gray-600">Add to your home screen</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sessionStorage.setItem("a2hs-dismissed", "1");
              setVisible(false);
            }}
            className="text-xs px-3 py-2 rounded-lg bg-gray-100 text-gray-700"
          >
            Not now
          </button>
          <button
            onClick={onInstall}
            className="text-xs px-3 py-2 rounded-lg bg-primary text-white"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}


