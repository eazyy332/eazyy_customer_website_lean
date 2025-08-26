import { useState } from "react";
import { Link } from "react-router-dom";

interface Notification {
  id: string;
  type: "discrepancy" | "quote" | "order_update" | "promotional";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
  priority: "high" | "medium" | "low";
  relatedOrderId?: string;
}

export default function Notifications() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "notif-1",
      type: "discrepancy",
      title: "Extra Items Found in Order",
      message:
        "We found 2 additional items in your order EZY-001234. Please review and approve or decline these items.",
      timestamp: "2024-01-22T10:30:00Z",
      isRead: false,
      actionUrl: "/discrepancy/123",
      actionText: "Review Items",
      priority: "high",
      relatedOrderId: "EZY-001234",
    },
    {
      id: "notif-2",
      type: "quote",
      title: "Custom Quote Ready",
      message:
        "Your custom quote for the vintage silk evening gown is ready for review. Price: €89.99",
      timestamp: "2024-01-21T14:15:00Z",
      isRead: false,
      actionUrl: "/quote-approval/456",
      actionText: "Review Quote",
      priority: "high",
      relatedOrderId: "QT-001234",
    },
    {
      id: "notif-3",
      type: "order_update",
      title: "Order Ready for Delivery",
      message:
        "Your order EZY-001232 has been completed and is ready for delivery.",
      timestamp: "2024-01-20T16:45:00Z",
      isRead: true,
      actionUrl: "/orders",
      actionText: "View Order",
      priority: "medium",
      relatedOrderId: "EZY-001232",
    },
    {
      id: "notif-4",
      type: "order_update",
      title: "Pickup Completed",
      message:
        "We have successfully picked up your items for order EZY-001233.",
      timestamp: "2024-01-19T09:20:00Z",
      isRead: true,
      priority: "low",
      relatedOrderId: "EZY-001233",
    },
    {
      id: "notif-5",
      type: "promotional",
      title: "Special Offer: 20% Off Dry Cleaning",
      message:
        "Get 20% off your next dry cleaning order. Valid until the end of the month.",
      timestamp: "2024-01-18T12:00:00Z",
      isRead: true,
      priority: "low",
    },
  ]);

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true })),
    );
  };

  const getNotificationIcon = (type: string, priority: string) => {
    const baseClasses =
      "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0";

    switch (type) {
      case "discrepancy":
        return (
          <div className={`${baseClasses} bg-orange-500`}>
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        );
      case "quote":
        return (
          <div className={`${baseClasses} bg-blue-500`}>
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        );
      case "order_update":
        return (
          <div className={`${baseClasses} bg-green-500`}>
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      case "promotional":
        return (
          <div className={`${baseClasses} bg-purple-500`}>
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 2v12a1 1 0 001 1h8a1 1 0 001-1V6M7 6h10"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className={`${baseClasses} bg-gray-500`}>
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const filteredNotifications =
    selectedFilter === "all"
      ? notifications
      : selectedFilter === "unread"
        ? notifications.filter((notif) => !notif.isRead)
        : notifications.filter((notif) => notif.type === selectedFilter);

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

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
            <Link
              to="/orders"
              className="text-black hover:text-primary transition-colors"
            >
              My Orders
            </Link>
            <div className="text-black">EN</div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="px-4 lg:px-16 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-medium text-black mb-2">
                Notifications
              </h1>
              <p className="text-gray-600">
                {unreadCount > 0
                  ? `${unreadCount} unread notifications`
                  : "All caught up!"}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-primary hover:text-blue-700 font-medium transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
            {[
              { key: "all", label: "All" },
              { key: "unread", label: "Unread", count: unreadCount },
              { key: "discrepancy", label: "Discrepancies" },
              { key: "quote", label: "Quotes" },
              { key: "order_update", label: "Order Updates" },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  selectedFilter === filter.key
                    ? "text-primary border-primary"
                    : "text-gray-600 border-transparent hover:text-black"
                }`}
              >
                {filter.label}
                {filter.count && filter.count > 0 && (
                  <span className="ml-2 px-2 py-1 bg-primary text-white text-xs rounded-full">
                    {filter.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M15 17h5l-5 5v-5zM11 19H6a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v6.5"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-medium text-black mb-2">
                No Notifications
              </h2>
              <p className="text-gray-600 mb-6">
                {selectedFilter === "all"
                  ? "You're all caught up! No notifications to show."
                  : `No ${selectedFilter} notifications to show.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white border rounded-xl p-6 transition-all hover:shadow-md ${
                    !notification.isRead
                      ? "border-primary shadow-sm"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {getNotificationIcon(
                      notification.type,
                      notification.priority,
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3
                          className={`font-medium ${!notification.isRead ? "text-black" : "text-gray-900"}`}
                        >
                          {notification.title}
                          {!notification.isRead && (
                            <span className="ml-2 w-2 h-2 bg-primary rounded-full inline-block"></span>
                          )}
                        </h3>
                        <span className="text-sm text-gray-500 ml-4 flex-shrink-0">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4">
                        {notification.message}
                      </p>

                      {notification.relatedOrderId && (
                        <div className="text-sm text-gray-500 mb-4">
                          Related to:{" "}
                          <span className="font-medium">
                            {notification.relatedOrderId}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center space-x-4">
                        {notification.actionUrl && notification.actionText && (
                          <Link
                            to={notification.actionUrl}
                            onClick={() => markAsRead(notification.id)}
                            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            {notification.actionText}
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
                          </Link>
                        )}

                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-12 bg-gray-50 rounded-xl p-8">
            <h3 className="text-xl font-medium text-black mb-6">
              Quick Actions
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                to="/orders"
                className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors group"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-black">View Orders</h4>
                  <p className="text-sm text-gray-600">Check order status</p>
                </div>
              </Link>

              <Link
                to="/order/start"
                className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors group"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-black">New Order</h4>
                  <p className="text-sm text-gray-600">Start a new order</p>
                </div>
              </Link>

              <Link
                to="/help"
                className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors group"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-black">Get Help</h4>
                  <p className="text-sm text-gray-600">FAQ and support</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
