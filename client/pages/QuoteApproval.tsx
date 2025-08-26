import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface QuoteItem {
  id: string;
  name: string;
  description: string;
  originalDescription: string; // customer's original description
  price: number;
  service: string;
  imageUrl: string;
  facilityNotes: string;
  estimatedDays: number;
  urgency: "standard" | "express" | "rush";
}

interface CustomQuoteOrder {
  quoteId: string;
  quoteNumber: string;
  customerEmail: string;
  requestDate: string;
  item: QuoteItem;
  status: "pending_approval" | "approved" | "declined";
}

export default function QuoteApproval() {
  const { quoteId } = useParams<{ quoteId: string }>();
  const navigate = useNavigate();
  const [decision, setDecision] = useState<"pending" | "approved" | "declined">(
    "pending",
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const [customQuote, setCustomQuote] = useState<CustomQuoteOrder | null>(null);

  useEffect(() => {
    async function loadQuote() {
      if (!quoteId) return;
      const { data, error } = await supabase
        .from('custom_price_quotes')
        .select('*')
        .eq('id', quoteId)
        .maybeSingle();
      if (error || !data) return;

      setCustomQuote({
        quoteId: data.id,
        quoteNumber: data.order_number || data.id,
        customerEmail: data.customer_email || '',
        requestDate: data.created_at,
        item: {
          id: data.id,
          name: data.item_name,
          description: data.description,
          originalDescription: data.description,
          price: data.facility_suggestion_price ?? data.suggested_price ?? 0,
          service: 'Custom Service',
          imageUrl: Array.isArray(data.image_url) && data.image_url.length ? data.image_url[0] : '',
          facilityNotes: data.facility_note || '',
          estimatedDays: data.suggested_time || 0,
          urgency: (data.urgency as any) || 'standard',
        },
        status: (data.status === 'quoted' ? 'pending_approval' : (data.status as any)) || 'pending_approval',
      });
    }
    loadQuote();
  }, [quoteId]);

  const handleDecision = async (newDecision: "approved" | "declined") => {
    if (!customQuote) return;
    if (newDecision === "declined" && !declineReason.trim()) {
      alert("Please provide a reason for declining the quote.");
      return;
    }

    setIsProcessing(true);

    try {
      if (newDecision === 'approved') {
        const { error: upErr } = await supabase
          .from('custom_price_quotes')
          .update({ status: 'accepted' })
          .eq('id', customQuote.quoteId);
        if (upErr) throw upErr;

        navigate("/order/scheduling", {
          state: {
            selectedServices: [
              {
                id: customQuote.item.id,
                name: customQuote.item.name,
                price: customQuote.item.price,
                quantity: 1,
                serviceCategory: "custom-quote",
              },
            ],
            totalPrice: customQuote.item.price,
            isCustomQuote: true,
            quoteNumber: customQuote.quoteNumber,
            sourceQuoteId: customQuote.quoteId,
          },
        });
      } else {
        await supabase
          .from('custom_price_quotes')
          .update({ status: 'declined', admin_note: declineReason || null })
          .eq('id', customQuote.quoteId);
        navigate("/orders", { state: { message: "Quote declined successfully", type: "info" } });
      }
    } catch (e) {
      console.error(e);
      alert('Failed to submit your decision. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case "express":
        return "Express (2-3 days)";
      case "rush":
        return "Rush (24-48 hours)";
      default:
        return "Standard (3-5 days)";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "express":
        return "bg-orange-100 text-orange-700";
      case "rush":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blue-100 text-blue-700";
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
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
              <Link to="/orders" className="hover:text-primary">
                My Orders
              </Link>
              <span>›</span>
              <span>Quote {customQuote.quoteNumber}</span>
              <span>›</span>
              <span className="text-black font-medium">Quote Review</span>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
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
                <div>
                  <h3 className="text-lg font-medium text-blue-900 mb-2">
                    Custom Quote Ready
                  </h3>
                  <p className="text-blue-800">
                    Our experts have reviewed your item and prepared a custom
                    quote. Please review the details and pricing below to
                    proceed with your order.
                  </p>
                </div>
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-medium text-black mb-2">
              Custom Quote Review
            </h1>
            <p className="text-gray-600">
              Quote {customQuote.quoteNumber} • Submitted{" "}
              {new Date(customQuote.requestDate).toLocaleDateString()}
            </p>
          </div>

          {/* Quote Details */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
            {/* Quote Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h3 className="font-medium text-black">
                    {customQuote.item.name}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(customQuote.item.urgency)}`}
                  >
                    {getUrgencyLabel(customQuote.item.urgency)}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    €{customQuote.item.price.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {customQuote.item.service}
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Item Image */}
                <div>
                  <img
                    src={customQuote.item.imageUrl}
                    alt={customQuote.item.name}
                    className="w-full h-80 object-cover rounded-lg"
                  />
                </div>

                {/* Quote Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-black mb-2">
                      Your Original Request
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 italic">
                        "{customQuote.item.originalDescription}"
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-black mb-2">
                      Expert Assessment
                    </h4>
                    <p className="text-gray-600">
                      {customQuote.item.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-black mb-2">
                      Facility Notes
                    </h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800">
                        {customQuote.item.facilityNotes}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-black mb-2">
                        Service Type
                      </h4>
                      <p className="text-gray-600">
                        {customQuote.item.service}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-black mb-2">
                        Estimated Time
                      </h4>
                      <p className="text-gray-600">
                        {customQuote.item.estimatedDays} business days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decision Section */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-medium text-black mb-4">
              Make Your Decision
            </h3>

            {decision === "pending" && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Would you like to proceed with this custom quote? If approved,
                  we'll add this item to your order and you can continue with
                  scheduling pickup and delivery.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setDecision("approved")}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 inline mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Accept Quote & Continue
                  </button>
                  <button
                    onClick={() => setDecision("declined")}
                    className="flex-1 bg-red-100 text-red-700 py-3 px-6 rounded-lg font-medium hover:bg-red-200 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 inline mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Decline Quote
                  </button>
                </div>
              </div>
            )}

            {decision === "approved" && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    Great choice! We'll take excellent care of your item.
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    Click continue to proceed with scheduling your pickup and
                    delivery.
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setDecision("pending")}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    ← Change Decision
                  </button>
                  <button
                    onClick={() => handleDecision("approved")}
                    disabled={isProcessing}
                    className="bg-primary text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? "Processing..." : "Continue to Order"}
                  </button>
                </div>
              </div>
            )}

            {decision === "declined" && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800 font-medium">
                    We understand this quote doesn't meet your needs.
                  </p>
                  <p className="text-red-700 text-sm mt-1">
                    Please let us know why you're declining so we can improve
                    our service.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Reason for declining (optional)
                  </label>
                  <textarea
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    placeholder="Price too high, timeline too long, etc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setDecision("pending")}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    ← Change Decision
                  </button>
                  <button
                    onClick={() => handleDecision("declined")}
                    disabled={isProcessing}
                    className="bg-red-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? "Processing..." : "Confirm Decline"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center pt-6 border-t border-gray-200">
            <Link
              to="/orders"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Orders
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
