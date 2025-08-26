import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MobileTabBar from "@/components/MobileTabBar";
import React, { useEffect } from "react";
import AddToHomeBanner from "@/components/AddToHomeBanner";
// FloatingCTA removed
import FloatingCartButton from "@/components/FloatingCartButton";

const Index = lazy(() => import("./pages/Index"));
const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Help = lazy(() => import("./pages/Help"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const OrderStart = lazy(() => import("./pages/OrderStart"));
const OrderServices = lazy(() => import("./pages/OrderServices"));
const ItemSelection = lazy(() => import("./pages/ItemSelection"));
const OrderScheduling = lazy(() => import("./pages/OrderScheduling"));
const OrderAddress = lazy(() => import("./pages/OrderAddress"));
const OrderPayment = lazy(() => import("./pages/OrderPayment"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const CustomQuote = lazy(() => import("./pages/CustomQuote"));
const QuoteConfirmation = lazy(() => import("./pages/QuoteConfirmation"));
const QuoteApproval = lazy(() => import("./pages/QuoteApproval"));
const DiscrepancyApproval = lazy(() => import("./pages/DiscrepancyApproval"));
const AdminLive = lazy(() => import("./pages/AdminLive"));
const Notifications = lazy(() => import("./pages/Notifications"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));
const OrderDetail = lazy(() => import("./pages/OrderDetail"));
const Messages = lazy(() => import("./pages/Messages"));
const Login = lazy(() => import("./pages/Login"));
const Cart = lazy(() => import("./pages/Cart"));

const queryClient = new QueryClient();

function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(() => void 0);
    }
  }, []);
  return null;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ServiceWorkerRegistrar />
              <SiteHeader />
              <div className="pb-20 md:pb-0">{/* reserve space for mobile tab bar */}
                <Suspense fallback={<div className="p-6">Loading…</div>}>
                  <ScrollToTop />
                  <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/privacy" element={<Privacy />} />

                  {/* Order Flow Routes */}
                  <Route path="/order/start" element={<OrderStart />} />
                  <Route path="/order/services" element={<OrderServices />} />
                  <Route path="/order/items/:category" element={<ItemSelection />} />
                  <Route path="/order/scheduling" element={<OrderScheduling />} />
                  <Route path="/order/address" element={<OrderAddress />} />
                  <Route path="/order/payment" element={<OrderPayment />} />
                  <Route path="/order/confirmation" element={<OrderConfirmation />} />
                  <Route path="/order/custom-quote" element={<CustomQuote />} />
                  <Route path="/quote/confirmation" element={<QuoteConfirmation />} />
                  <Route path="/quote-approval/:quoteId" element={<QuoteApproval />} />
                  <Route path="/discrepancy/:orderId" element={<DiscrepancyApproval />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/admin/live" element={<AdminLive />} />
                  <Route path="/orders" element={<OrderHistory />} />
                  <Route path="/order/:id" element={<OrderDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/account" element={<Login />} />
                  <Route path="/messages" element={<Messages />} />

                  {/* Legacy Routes */}
                  <Route path="/personal" element={<Services />} />
                  <Route path="/business" element={<Services />} />
                  <Route path="/company" element={<About />} />
                  <Route path="/complaints" element={<Help />} />
                  <Route path="/cookie-policy" element={<Privacy />} />
                  <Route path="/website-terms" element={<Privacy />} />
                  <Route path="/legal-agreements" element={<Privacy />} />
                  <Route path="/modern-slavery-policy" element={<Privacy />} />
                  <Route path="/terms" element={<Privacy />} />

                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
              <AddToHomeBanner />
              <FloatingCartButton />
              <MobileTabBar />
              <SiteFooter />
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
