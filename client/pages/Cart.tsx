import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Item icons (same set as item selection)
const tshirtIcon = "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop";
const poloIcon = "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop";
const henleyIcon = "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop";
const teeGraphicIcon = "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop";
const foldedBagIcon = "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  serviceCategory: string;
  subcategory?: string;
  isCustomQuote?: boolean;
  quoteStatus?: 'pending' | 'quoted' | 'accepted';
}

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("eazzy-cart");
    setCart(saved ? JSON.parse(saved) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem("eazzy-cart", JSON.stringify(cart));
    try {
      window.dispatchEvent(new CustomEvent('cart:updated'));
    } catch {}
  }, [cart]);

  const updateQty = (id: string, serviceCategory: string, qty: number) => {
    setCart(prev =>
      qty <= 0
        ? prev.filter(i => !(i.id === id && i.serviceCategory === serviceCategory))
        : prev.map(i => (i.id === id && i.serviceCategory === serviceCategory ? { ...i, quantity: qty } : i)),
    );
  };

  const totalItems = cart.reduce((t, i) => t + i.quantity, 0);
  const totalPrice = cart.reduce((t, i) => {
    if (i.isCustomQuote) return t; // Don't include custom quotes in price calculation
    return t + i.price * i.quantity;
  }, 0);
  const hasCustomQuotes = cart.some(item => item.isCustomQuote);

  const getItemImage = (item: CartItem) => {
    const name = (item.name || "").toLowerCase();
    if (name.includes("bag")) return foldedBagIcon;
    if (name.includes("polo")) return poloIcon;
    if (name.includes("henley")) return henleyIcon;
    if (name.includes("t-shirt") || name.includes("tee") || name.includes("shirt")) return tshirtIcon;
    return teeGraphicIcon;
  };

  const proceed = () => {
    if (cart.length === 0) return;
    navigate("/order/scheduling", {
      state: {
        selectedServices: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, serviceCategory: i.serviceCategory })),
        totalPrice,
      },
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="px-4 md:px-8 lg:px-12 pt-8 pb-24">
        <div className="max-w-[960px] mx-auto">
          <div className="mb-6">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link to="/order/start" className="hover:text-primary">Service Categories</Link>
              <span>›</span>
              <span className="text-black font-medium">Cart</span>
            </nav>
          </div>

          <h1 className="text-3xl font-medium text-black mb-6">Your Cart</h1>

          {cart.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 p-8 text-center">
              <p className="text-gray-600 mb-4">Your cart is empty.</p>
              <Link to="/order/start" className="inline-flex rounded-full bg-primary text-white px-5 py-3 font-semibold">Add services</Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-3">
                {cart.map(item => (
                  <div key={`${item.serviceCategory}-${item.id}`} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-2xl border border-gray-200 p-4">
                    <div className="flex items-center gap-4">
                      <img src={getItemImage(item)} alt="" className="w-12 h-12 object-contain" />
                      <div>
                        <div className="text-black font-medium">{item.name}</div>
                          {item.isCustomQuote && (
                            <div className="text-xs text-orange-600 font-medium">Custom Quote Pending</div>
                          )}
                        <div className="text-xs text-gray-600 capitalize">{item.serviceCategory.replace('-', ' ')}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 justify-self-end w-[120px]">
                      <button className="w-8 h-8 rounded-full border border-gray-300" onClick={() => updateQty(item.id, item.serviceCategory, item.quantity - 1)}>−</button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button className="w-8 h-8 rounded-full border border-gray-300" onClick={() => updateQty(item.id, item.serviceCategory, item.quantity + 1)}>+</button>
                    </div>
                    <span className="text-lg font-semibold text-black">
                      {hasCustomQuotes ? (
                        <span className="text-sm">€{totalPrice.toFixed(2)} + quotes</span>
                      ) : (
                        <span>€{totalPrice.toFixed(2)}</span>
                      )}
                    </span>
                  </div>
                  {hasCustomQuotes && (
                    <div className="text-xs text-orange-600 mb-2">
                      * Custom quote prices will be added after review
                    </div>
                  )}
                ))}
              </div>

              <div className="md:col-span-1">
                <div className="rounded-2xl border border-gray-200 p-5 sticky top-6">
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="text-gray-600">Items</span>
                      {item.isCustomQuote ? (
                        <div className="justify-self-end w-[120px] text-center">
                          <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 justify-self-end w-[120px]">
                          <button className="w-8 h-8 rounded-full border border-gray-300" onClick={() => updateQty(item.id, item.serviceCategory, item.quantity - 1)}>−</button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button className="w-8 h-8 rounded-full border border-gray-300" onClick={() => updateQty(item.id, item.serviceCategory, item.quantity + 1)}>+</button>
                        </div>
                      )}
                      <div className="text-primary font-semibold justify-self-end w-[90px] text-right">
                        {item.isCustomQuote ? (
                          <span className="text-sm text-orange-600">Quote Pending</span>
                        ) : (
                          <span>€{(item.price * item.quantity).toFixed(2)}</span>
                        )}
                      </div>
                  <button onClick={proceed} className="w-full rounded-full bg-primary text-white px-5 py-3 font-semibold mb-2">Continue to scheduling</button>
                  <Link to="/order/start" className="block w-full text-center rounded-full border border-gray-300 px-5 py-3 font-medium">Add more items</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


