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
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
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
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-medium text-black mb-4 leading-tight">
              Schedule Pickup & Delivery
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose convenient times for pickup and delivery
            </p>
          </div>

          {/* Simple Scheduling */}
          <div className="space-y-6">
            {/* Pickup Scheduling */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-lg">📦</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-black">
                      Pickup Schedule
                    </h3>
                    <p className="text-gray-600 text-sm">
                      When should we collect your items?
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Quick Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select pickup date
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {quickDates.map((date, index) => {
                      const dateString = date.toISOString().split("T")[0];
                      const isSelected = schedule.pickupDate === dateString;
                      return (
                        <button
                          key={index}
                          onClick={() =>
                            handleScheduleChange("pickupDate", dateString)
                          }
                          className={`p-3 rounded-lg text-center transition-all border ${
                            isSelected
                              ? "bg-primary text-white border-primary shadow-sm"
                              : "bg-white hover:bg-gray-50 text-gray-900 border-gray-200"
                          }`}
                        >
                          <div className="text-xs font-medium leading-tight">
                            {formatDateOption(date)}
                          </div>
                          <div className="text-base font-semibold mt-0.5">
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
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() =>
                            handleScheduleChange("pickupTime", time)
                          }
                          className={`p-3 rounded-lg text-sm font-medium transition-all border ${
                            schedule.pickupTime === time
                              ? "bg-primary text-white border-primary shadow-sm"
                              : "bg-white hover:bg-gray-50 text-gray-900 border-gray-200"
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🚚</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-black">
                        Delivery Schedule
                      </h3>
                      <p className="text-gray-600 text-sm">
                        When should we return your items?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Delivery Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select delivery date
                    </label>
                    <div className="grid grid-cols-7 gap-2">
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
                            className={`p-3 rounded-lg text-center transition-all border ${
                              isDisabled
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                                : isSelected
                                  ? "bg-primary text-white border-primary shadow-sm"
                                  : "bg-white hover:bg-gray-50 text-gray-900 border-gray-200"
                            }`}
                          >
                             <div className="text-xs font-medium leading-tight">
                               {formatDateOption(date)}
                             </div>
                             <div className="text-base font-semibold mt-0.5">
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
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() =>
                              handleScheduleChange("deliveryTime", time)
                            }
                            className={`p-3 rounded-lg text-sm font-medium transition-all border ${
                              schedule.deliveryTime === time
                                ? "bg-primary text-white border-primary shadow-sm"
                                : "bg-white hover:bg-gray-50 text-gray-900 border-gray-200"
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
              <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
                <h3 className="text-lg font-medium text-black mb-4">
                  Schedule Summary
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                      <span className="text-lg">📦</span>
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
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                      <span className="text-lg">🚚</span>
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-lg">📋</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-black">
                            Delivery Preferences
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Optional delivery instructions
                          </p>
                        </div>
                      </div>
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        Optional
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                          className={`p-3 rounded-lg text-sm font-medium transition-all border ${
                            schedule.deliveryPreferences === pref
                              ? "bg-primary text-white border-primary shadow-sm"
                              : "bg-white hover:bg-gray-50 text-gray-900 border-gray-200"
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
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-200">
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
                className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-sm"
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
              <div className="text-sm text-gray-500 text-center">
                Complete scheduling to continue
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
