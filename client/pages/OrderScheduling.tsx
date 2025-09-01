import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface ScheduleData {
  pickupDate: string;
  pickupTime: string;
  deliveryDate: string;
  deliveryTime: string;
  deliveryPreferences: string;
}

export default function OrderScheduling() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { selectedServices, totalPrice, sourceQuoteId } = location.state || {
    selectedServices: [],
    totalPrice: 0,
  };

  // Also check localStorage for cart items
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("eazzy-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Use either passed services or cart items
  const services = selectedServices.length > 0 ? selectedServices : cartItems;
  const calculatedTotalPrice =
    totalPrice > 0
      ? totalPrice
      : services.reduce(
          (total: number, item: any) => total + item.price * item.quantity,
          0,
        );

  const [schedule, setSchedule] = useState<ScheduleData>({
    pickupDate: "",
    pickupTime: "",
    deliveryDate: "",
    deliveryTime: "",
    deliveryPreferences: "",
  });

  // Generate quick date options (today + next 6 days)
  const getQuickDateOptions = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const quickDates = getQuickDateOptions();

  const timeSlots = [
    "9:00 - 11:00 AM",
    "11:00 AM - 1:00 PM",
    "1:00 - 3:00 PM",
    "3:00 - 5:00 PM",
    "5:00 - 7:00 PM",
  ];

  const canProceed =
    schedule.pickupDate &&
    schedule.pickupTime &&
    schedule.deliveryDate &&
    schedule.deliveryTime;

  const handleScheduleChange = (field: keyof ScheduleData, value: string) => {
    setSchedule((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    if (!isAuthenticated) {
      // Store order data in localStorage before redirecting to login
      localStorage.setItem('pendingOrder', JSON.stringify({
        selectedServices: services,
        totalPrice: calculatedTotalPrice,
        schedule,
        sourceQuoteId,
        returnTo: '/order/address'
      }));
      navigate('/login');
      return;
    }
    
    navigate('/order/address', {
      state: {
        selectedServices: services,
        totalPrice: calculatedTotalPrice,
        schedule,
        sourceQuoteId,
      }
    });
  };

  const formatDateOption = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tmrw"; // compact for mobile
    } else {
      // Only short weekday for compact display inside the chip
      return date.toLocaleDateString("en-US", { weekday: "short" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="hidden">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-black hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/services"
              className="text-black hover:text-primary transition-colors"
            >
              Services
            </Link>
            <Link
              to="/about"
              className="text-black hover:text-primary transition-colors"
            >
              About us
            </Link>
            <Link
              to="/contact"
              className="text-black hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0ba0452a2d1340e7b84136d8ed253a1b%2Fb6e642e462f04f14827396626baf4d5e?format=webp&width=800"
              alt="eazyy logo"
              className="h-8 w-auto"
            />
          </div>
          <div className="flex items-center space-x-6">
            <Link
              to="/help"
              className="text-black hover:text-primary transition-colors"
            >
              Help
            </Link>
            <div className="text-black">EN</div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="px-4 lg:px-16 py-8">
        <div className="max-w-[960px] mx-auto">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
              <span className="text-gray-400">Services</span>
              <span className="text-primary font-semibold">Scheduling</span>
              <span>Address</span>
              <span>Payment</span>
              <span>Confirmation</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-primary to-blue-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: "40%" }}
              ></div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 h-9 px-4 rounded-[10px] bg-[#E9F1FF] mb-6">
              <svg className="w-5 h-6 text-[#1D62DB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span className="text-[#1D62DB] font-medium">pickup & delivery</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-medium text-black mb-4 leading-tight">
              When Works Best
            </h1>
            <h1 className="text-3xl md:text-5xl font-medium text-black mb-6 leading-tight">
              For You?
            </h1>
            <p className="text-black text-base md:text-lg leading-relaxed max-w-md mx-auto">
              Select your preferred pickup and delivery times
            </p>
          </div>

          {/* Simple Scheduling */}
          <div className="space-y-6">
            {/* Pickup Scheduling */}
            <div className="bg-white rounded-[28px] border border-gray-200 overflow-hidden shadow-[0_8px_30px_rgba(17,24,39,0.08)]">
              <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-black">
                      Pickup Schedule
                    </h3>
                    <p className="text-gray-600 text-sm">
                      When should we collect your items?
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Quick Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select pickup date
                  </label>
                  <div className="grid grid-cols-7 gap-3">
                    {quickDates.map((date, index) => {
                      const dateString = date.toISOString().split("T")[0];
                      const isSelected = schedule.pickupDate === dateString;
                      return (
                        <button
                          key={index}
                          onClick={() =>
                            handleScheduleChange("pickupDate", dateString)
                          }
                          className={`p-4 rounded-xl text-center transition-all border ${
                            isSelected
                              ? "bg-primary text-white border-primary shadow-lg"
                              : "bg-gray-50 hover:bg-gray-100 text-gray-900 border-gray-200 hover:border-primary"
                          }`}
                        >
                          <div className="text-xs font-medium leading-tight">
                            {formatDateOption(date)}
                          </div>
                          <div className="text-lg font-semibold mt-1">
                            {date.toLocaleDateString('en-US',{ month: 'short', day: 'numeric' })}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pickup Time Selection */}
                {schedule.pickupDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select pickup time
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() =>
                            handleScheduleChange("pickupTime", time)
                          }
                          className={`p-4 rounded-xl text-sm font-medium transition-all border ${
                            schedule.pickupTime === time
                              ? "bg-primary text-white border-primary shadow-lg"
                              : "bg-gray-50 hover:bg-gray-100 text-gray-900 border-gray-200 hover:border-primary"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Scheduling */}
            {schedule.pickupDate && schedule.pickupTime && (
              <div className="bg-white rounded-[28px] border border-gray-200 overflow-hidden shadow-[0_8px_30px_rgba(17,24,39,0.08)]">
                <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-black">
                        Delivery Schedule
                      </h3>
                      <p className="text-gray-600 text-sm">
                        When should we return your items?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {/* Delivery Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select delivery date
                    </label>
                    <div className="grid grid-cols-7 gap-3">
                      {quickDates.map((date, index) => {
                        const dateString = date.toISOString().split("T")[0];
                        const pickupDate = new Date(schedule.pickupDate);
                        const isDisabled = date <= pickupDate;
                        const isSelected = schedule.deliveryDate === dateString;

                        return (
                          <button
                            key={index}
                            disabled={isDisabled}
                            onClick={() =>
                              !isDisabled &&
                              handleScheduleChange("deliveryDate", dateString)
                            }
                            className={`p-4 rounded-xl text-center transition-all border ${
                              isDisabled
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200 opacity-50"
                                : isSelected
                                  ? "bg-primary text-white border-primary shadow-lg"
                                  : "bg-gray-50 hover:bg-gray-100 text-gray-900 border-gray-200 hover:border-primary"
                            }`}
                          >
                             <div className="text-xs font-medium leading-tight">
                               {formatDateOption(date)}
                             </div>
                             <div className="text-lg font-semibold mt-1">
                               {date.toLocaleDateString('en-US',{ month: 'short', day: 'numeric' })}
                             </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivery Time Selection */}
                  {schedule.deliveryDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Select delivery time
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() =>
                              handleScheduleChange("deliveryTime", time)
                            }
                            className={`p-4 rounded-xl text-sm font-medium transition-all border ${
                              schedule.deliveryTime === time
                                ? "bg-primary text-white border-primary shadow-lg"
                                : "bg-gray-50 hover:bg-gray-100 text-gray-900 border-gray-200 hover:border-primary"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Summary Card */}
            {schedule.pickupDate && schedule.deliveryDate && (
              <div className="bg-[#E9F1FF] rounded-[28px] p-8 border border-blue-100 shadow-[0_8px_30px_rgba(17,24,39,0.08)]">
                <h3 className="text-lg font-medium text-black mb-4">
                  Schedule Summary
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-200 shadow-sm">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Pickup</div>
                      <div className="font-medium text-black">
                        {new Date(schedule.pickupDate).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </div>
                      {schedule.pickupTime && (
                        <div className="text-sm text-gray-600">
                          {schedule.pickupTime}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-200 shadow-sm">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Delivery</div>
                      <div className="font-medium text-black">
                        {new Date(schedule.deliveryDate).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </div>
                      {schedule.deliveryTime && (
                        <div className="text-sm text-gray-600">
                          {schedule.deliveryTime}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Preferences */}
            {schedule.pickupDate &&
              schedule.pickupTime &&
              schedule.deliveryDate &&
              schedule.deliveryTime && (
                <div className="bg-white rounded-[28px] border border-gray-200 overflow-hidden shadow-[0_8px_30px_rgba(17,24,39,0.08)]">
                  <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-medium text-black">
                            Delivery Preferences
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Optional delivery instructions
                          </p>
                        </div>
                      </div>
                      <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                        Optional
                      </span>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        "Leave at door",
                        "Call first",
                        "Concierge",
                        "Hold for pickup",
                      ].map((pref) => (
                        <button
                          key={pref}
                          onClick={() =>
                            handleScheduleChange(
                              "deliveryPreferences",
                              schedule.deliveryPreferences === pref ? "" : pref,
                            )
                          }
                          className={`p-4 rounded-xl text-sm font-medium transition-all border ${
                            schedule.deliveryPreferences === pref
                              ? "bg-primary text-white border-primary shadow-lg"
                              : "bg-gray-50 hover:bg-gray-100 text-gray-900 border-gray-200 hover:border-primary"
                          }`}
                        >
                          {pref}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-gray-200">
            <Link
              to="/order/start"
              className="inline-flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Services
            </Link>

            {canProceed ? (
              <button
                onClick={handleContinue}
                className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                Continue to Address
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ) : (
              <div className="text-sm text-gray-500 text-center px-4">
                Complete scheduling to continue
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
