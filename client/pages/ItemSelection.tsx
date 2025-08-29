import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose, DrawerTrigger } from "@/components/ui/drawer";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabase";

// Item icons (served as static paths)
const tshirtIcon = "/images_devlopment/32e5a8a6-1220-49e7-aa82-3734440a5043.png";
const poloIcon = "/images_devlopment/d65570c9-c43d-49e8-a750-31de4ade14a5.png";
const henleyIcon = "/images_devlopment/958ab653-5129-45c7-a1a9-0b216c2cac0c.png";
const teeGraphicIcon = "/images_devlopment/f000823d-5a30-4ba8-8d76-30dde432ce90.png";
const foldedBagIcon = "/images_devlopment/d5eb7a60-2415-444e-9926-a21b54dfbea1.png";
const altIcon = "/images_devlopment/a9264dd0-4fa0-43eb-a418-143762649914.png";

// Service selector icons (per your assets)
const iconBag = "/images_devlopment/eazyy-bag-service-icon.png";
const iconWashIron = "/images_devlopment/wash-andiron-service.png";
const iconDry = "/images_devlopment/dry-clean-service-icon.png";
const iconRepair = "/images_devlopment/repair-service-icon.png";

// Hero images (fallback to service icons if dedicated assets are missing)
const heroEazzy = iconBag;
const heroDry = iconDry;
const heroWash = iconWashIron;
const heroRepair = iconRepair;

function normalizeCategorySlug(raw: string): string {
  const map: Record<string, string> = {
    "eazyy-bag": "eazyy-bag", 
    "eazy-bag": "eazyy-bag",
    "eazzy-bag": "eazyy-bag", // Handle the typo variant
    "wash-and-iron": "wash-iron",
    "dry-clean": "dry-cleaning",
    "drycleaning": "dry-cleaning",
    "repair": "repairs",
  };
  return map[raw] || raw;
}

interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  quantity: number;
}

interface CartItem extends Item {
  serviceCategory: string;
}

export default function ItemSelection() {
  const params = useParams<{ category: string }>();
  const rawCategory = params.category || "";
  const category = normalizeCategorySlug(rawCategory);
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [service, setService] = useState<any | null>(null);
  const [categoriesDb, setCategoriesDb] = useState<any[]>([]);
  const [itemsDb, setItemsDb] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [dynamicInputs, setDynamicInputs] = useState<Record<string, number>>({});

  // Service data organized by category
  const serviceData: Record<string, any> = {
    'eazzy-bag': {
      name: 'eazzy Bag Services',
      description: 'Choose from different bag sizes and laundry options',
      icon: '🧺',
      items: [
        { id: 'small-bag', name: 'Small Bag (up to 5 lbs)', description: 'Perfect for a few items or undergarments', price: 15.99, subcategory: 'bags', icon: '👝' },
        { id: 'regular-bag', name: 'Regular Bag (up to 10 lbs)', description: 'Standard size for weekly laundry', price: 24.99, subcategory: 'bags', icon: '🎒' },
        { id: 'large-bag', name: 'Large Bag (up to 15 lbs)', description: 'Maximum capacity for families', price: 34.99, subcategory: 'bags', icon: '🧳' },
        { id: 'delicate-bag', name: 'Delicate Items Bag', description: 'Special care for sensitive fabrics', price: 29.99, subcategory: 'specialty', icon: '🌸' },
        { id: 'eco-bag', name: 'Eco-Friendly Wash Bag', description: 'Environmentally conscious cleaning', price: 27.99, subcategory: 'specialty', icon: '🌿' }
      ],
      subcategories: ['all', 'bags', 'specialty']
    },
    'wash-iron': {
      name: 'Wash & Iron Services',
      description: 'Individual items professionally washed and ironed',
      icon: '👔',
      items: [
        { id: 'dress-shirt', name: 'Dress Shirt', description: 'Professional shirt cleaning and pressing', price: 4.99, subcategory: 'shirts', icon: '👔' },
        { id: 'casual-shirt', name: 'Casual Shirt', description: 'Regular shirt wash and iron', price: 3.99, subcategory: 'shirts', icon: '👕' },
        { id: 'blouse', name: 'Blouse', description: 'Delicate blouse care', price: 5.99, subcategory: 'shirts', icon: '👚' },
        { id: 'trousers', name: 'Trousers', description: 'Professional trouser pressing', price: 6.99, subcategory: 'pants', icon: '👖' },
        { id: 'jeans', name: 'Jeans', description: 'Denim wash and press', price: 5.99, subcategory: 'pants', icon: '👖' },
        { id: 'skirt', name: 'Skirt', description: 'Skirt cleaning and pressing', price: 5.99, subcategory: 'other', icon: '👗' },
        { id: 'polo-shirt', name: 'Polo Shirt', description: 'Polo shirt wash and iron', price: 4.99, subcategory: 'shirts', icon: '👕' },
        { id: 'chinos', name: 'Chinos', description: 'Chino pants cleaning', price: 6.99, subcategory: 'pants', icon: '👖' }
      ],
      subcategories: ['all', 'shirts', 'pants', 'other']
    },
    'dry-cleaning': {
      name: 'Dry Cleaning Services',
      description: 'Professional dry cleaning for delicate and special items',
      icon: '🧼',
      items: [
        { id: 'suit-jacket', name: 'Suit Jacket', description: 'Professional suit jacket cleaning', price: 15.99, subcategory: 'suits', icon: '🤵' },
        { id: 'suit-pants', name: 'Suit Pants', description: 'Matching suit trouser cleaning', price: 12.99, subcategory: 'suits', icon: '👔' },
        { id: 'dress', name: 'Dress', description: 'Elegant dress dry cleaning', price: 18.99, subcategory: 'dresses', icon: '👗' },
        { id: 'evening-gown', name: 'Evening Gown', description: 'Special occasion dress care', price: 35.99, subcategory: 'dresses', icon: '👰' },
        { id: 'coat', name: 'Coat', description: 'Winter coat cleaning', price: 25.99, subcategory: 'outerwear', icon: '🧥' },
        { id: 'blazer', name: 'Blazer', description: 'Business blazer cleaning', price: 16.99, subcategory: 'suits', icon: '🤵' },
        { id: 'wool-sweater', name: 'Wool Sweater', description: 'Delicate wool care', price: 13.99, subcategory: 'knitwear', icon: '🧶' },
        { id: 'cashmere', name: 'Cashmere Item', description: 'Luxury cashmere cleaning', price: 22.99, subcategory: 'knitwear', icon: '✨' },
        { id: 'leather-jacket', name: 'Leather Jacket', description: 'Specialized leather cleaning', price: 45.99, subcategory: 'specialty', icon: '🧥' },
        { id: 'fur-item', name: 'Fur Item', description: 'Expert fur care and storage', price: 89.99, subcategory: 'specialty', icon: '🦔' }
      ],
      subcategories: ['all', 'suits', 'dresses', 'outerwear', 'knitwear', 'specialty']
    },
    'repairs': {
      name: 'Repairs & Alterations',
      description: 'Tailoring and repair services for your garments',
      icon: '✂️',
      items: [
        { id: 'hem-pants', name: 'Hem Pants', description: 'Adjust trouser length', price: 12.99, subcategory: 'hemming', icon: '📏' },
        { id: 'hem-dress', name: 'Hem Dress', description: 'Adjust dress length', price: 15.99, subcategory: 'hemming', icon: '📐' },
        { id: 'hem-skirt', name: 'Hem Skirt', description: 'Adjust skirt length', price: 13.99, subcategory: 'hemming', icon: '📏' },
        { id: 'take-in-waist', name: 'Take in Waist', description: 'Reduce waist size', price: 18.99, subcategory: 'fitting', icon: '📎' },
        { id: 'let-out-waist', name: 'Let out Waist', description: 'Increase waist size', price: 16.99, subcategory: 'fitting', icon: '📎' },
        { id: 'shorten-sleeves', name: 'Shorten Sleeves', description: 'Adjust sleeve length', price: 14.99, subcategory: 'fitting', icon: '✂️' },
        { id: 'replace-zipper', name: 'Replace Zipper', description: 'New zipper installation', price: 19.99, subcategory: 'repairs', icon: '🔧' },
        { id: 'button-replacement', name: 'Button Replacement', description: 'Replace missing buttons', price: 8.99, subcategory: 'repairs', icon: '🔘' },
        { id: 'patch-hole', name: 'Patch Small Hole', description: 'Repair small tears or holes', price: 12.99, subcategory: 'repairs', icon: '🪡' },
        { id: 'reinforcement', name: 'Reinforcement', description: 'Strengthen weak seams', price: 11.99, subcategory: 'repairs', icon: '💪' }
      ],
      subcategories: ['all', 'hemming', 'fitting', 'repairs']
    }
  };

  const allowedSlugs = new Set(Object.keys(serviceData));
  const currentService = serviceData[category || ''];

  const serviceMeta: Record<string, { title: string; description: string; hero: string; accent: string; label: string } > = {
    'eazzy-bag': {
      title: 'eazyy Bag',
      description: "Fill a bag. We'll handle the rest. Weight-based washing with pickup & delivery on your schedule.",
      hero: heroEazzy,
      accent: '#1D62DB',
      label: 'Laundry'
    },
    'dry-cleaning': {
      title: 'Dry Cleaning',
      description: 'Crisp care for delicate garments. Professional solvent cleaning and finishing, picked up and delivered.',
      hero: heroDry,
      accent: '#16A34A',
      label: 'Dry clean'
    },
    'wash-iron': {
      title: 'Wash & Iron',
      description: 'Washed. Pressed. Delivered. Per-item washing and precise ironing, picked up and delivered on your schedule.',
      hero: heroWash,
      accent: '#DC2626',
      label: 'Wash & iron'
    },
    'repairs': {
      title: 'Repairs',
      description: "Fix, tailor, and extend your garment's life. From hemming to zippers—skilled repairs with pickup & delivery.",
      hero: heroRepair,
      accent: '#F59E0B',
      label: 'Repairs'
    }
  };
  
  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('eazzy-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Load from DB when switching service slug
  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!rawCategory) return;
      setLoading(true);
      console.debug('[ItemSelection] route', { rawCategory, normalized: category });
      
      // Try both the raw category and normalized category for service lookup
      const { data: svc } = await supabase
        .from('services')
        .select('*')
        .or(`service_identifier.eq.${rawCategory},service_identifier.eq.${category},service_identifier.eq.eazyy-bag,service_identifier.eq.easy-bag`)
        .maybeSingle();
      
      if (!mounted) return;
      setService(svc);
      if (svc?.id) {
        const [{ data: cats }, { data: items }] = await Promise.all([
          supabase.from('categories').select('*').eq('service_id', svc.id).order('sequence', { ascending: true }),
          supabase.from('items').select('*').eq('service_id', svc.id).order('sequence', { ascending: true }),
        ]);
        if (!mounted) return;
        setCategoriesDb(cats || []);
        setItemsDb(items || []);
      } else {
        console.warn('[ItemSelection] No service found for identifier:', { rawCategory, normalized: category });
        setCategoriesDb([]);
        setItemsDb([]);
      }
      setSelectedSubcategory('all');
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [rawCategory, category]);

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem('eazzy-cart', JSON.stringify(cart));
    // Dispatch cart updated event
    try {
      window.dispatchEvent(new CustomEvent('cart:updated'));
    } catch {}
  }, [cart]);

  const addToCart = (item: any) => {
    const cartItem: CartItem = {
      ...item,
      serviceCategory: category,
      quantity: 1
    };
    
    setCart(prev => {
      const existingIndex = prev.findIndex(
        i => i.id === item.id && i.serviceCategory === category
      );
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prev, cartItem];
      }
    });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(prev => prev.filter(
        i => !(i.id === itemId && i.serviceCategory === category)
      ));
    } else {
      setCart(prev => prev.map(i => 
        i.id === itemId && i.serviceCategory === category 
          ? { ...i, quantity: newQuantity }
          : i
      ));
    }
  };

  const getItemQuantity = (itemId: string) => {
    const item = cart.find(i => i.id === itemId && i.serviceCategory === category);
    return item?.quantity || 0;
  };

  const getItemImage = (item: any) => {
    const name = (item.name || "").toLowerCase();
    if (name.includes("bag")) return foldedBagIcon;
    if (name.includes("polo")) return poloIcon;
    if (name.includes("henley")) return henleyIcon;
    if (name.includes("t-shirt") || name.includes("tee") || name.includes("shirt")) return tshirtIcon;
    return teeGraphicIcon;
  };

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalCartPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Use fallback data if no service found or loading
  const displayService = service || currentService;
  const displayItems = itemsDb.length > 0 ? itemsDb : (currentService?.items || []);
  const displayCategories = categoriesDb.length > 0 ? categoriesDb : (currentService?.subcategories || ['all']);

  const filteredItems = selectedSubcategory === 'all' 
    ? displayItems 
    : displayItems.filter((item: any) => item.subcategory === selectedSubcategory);

  if (!allowedSlugs.has(category)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Service Category Not Found</h2>
          <p className="text-gray-600 mb-6">The service category "{category}" is not available.</p>
          <Link 
            to="/order/start" 
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading items...</p>
        </div>
      </div>
    );
  }

  const meta = serviceMeta[category] || {
    title: displayService?.name || 'Service',
    description: displayService?.description || 'Select items for this service',
    hero: altIcon,
    accent: '#1D62DB',
    label: 'Service'
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="px-4 md:px-8 lg:px-12 pt-8 pb-24">
        <div className="max-w-[960px] mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link to="/order/start" className="hover:text-primary">Service Categories</Link>
              <span>›</span>
              <span className="text-black font-medium">{meta.title}</span>
            </nav>
          </div>

          {/* Service Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                <img src={meta.hero} alt={meta.title} className="w-10 h-10 object-contain" />
              </div>
              <div>
                <h1 className="text-3xl font-medium text-black">{meta.title}</h1>
                <p className="text-gray-600">{meta.description}</p>
              </div>
            </div>
          </div>

          {/* Subcategory Filter */}
          {displayCategories.length > 1 && (
            <div className="mb-8">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {displayCategories.map((subcat: string) => (
                  <button
                    key={subcat}
                    onClick={() => setSelectedSubcategory(subcat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedSubcategory === subcat
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {subcat === 'all' ? 'All Items' : subcat.charAt(0).toUpperCase() + subcat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredItems.map((item: any) => {
              const quantity = getItemQuantity(item.id);
              const isCustomPricing = item.custom_pricing || item.is_custom_price;
              const dynamicValue = dynamicInputs[item.id] || item.min_input_value || 1;
              const displayPrice = isCustomPricing 
                ? (item.unit_price || 0) * dynamicValue 
                : item.price;

              return (
                <div key={item.id} className="rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={getItemImage(item)} 
                      alt={item.name} 
                      className="w-12 h-12 object-contain" 
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-black">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>

                  {/* Custom Pricing Input */}
                  {isCustomPricing && (
                    <div className="mb-4">
                      <label className="block text-sm text-gray-600 mb-2">
                        {item.unit_label || 'Quantity'}
                      </label>
                      <input
                        type="number"
                        min={item.min_input_value || 1}
                        max={item.max_input_value || 100}
                        value={dynamicValue}
                        onChange={(e) => setDynamicInputs(prev => ({
                          ...prev,
                          [item.id]: Number(e.target.value)
                        }))}
                        placeholder={item.input_placeholder || 'Enter amount'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-primary">
                      €{displayPrice?.toFixed(2) || '0.00'}
                      {isCustomPricing && item.unit_label && (
                        <span className="text-sm text-gray-600 ml-1">
                          per {item.unit_label}
                        </span>
                      )}
                    </div>

                    {quantity === 0 ? (
                      <button
                        onClick={() => addToCart({
                          ...item,
                          price: displayPrice,
                          custom_input_value: isCustomPricing ? dynamicValue : null
                        })}
                        className="rounded-full bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, quantity - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-medium">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, quantity + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-4.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-black mb-2">No Items Available</h3>
              <p className="text-gray-600 mb-4">
                {selectedSubcategory === 'all' 
                  ? 'No items found for this service category.'
                  : `No items found in the "${selectedSubcategory}" category.`
                }
              </p>
              <Link 
                to="/order/start" 
                className="inline-block bg-primary text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                Choose Different Service
              </Link>
            </div>
          )}

          {/* Cart Summary */}
          {totalCartItems > 0 && (
            <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 bg-white rounded-2xl border border-gray-200 p-4 shadow-lg z-40">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-medium text-black">{totalCartItems} items</div>
                  <div className="text-sm text-gray-600">€{totalCartPrice.toFixed(2)} total</div>
                </div>
                <Link 
                  to="/cart"
                  className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  View Cart
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Cart Drawer */}
      <Drawer open={cartOpen} onOpenChange={setCartOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Your Cart</DrawerTitle>
            <DrawerDescription>
              {totalCartItems} items • €{totalCartPrice.toFixed(2)}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6">
            {cart.length === 0 ? (
              <p className="text-gray-600 text-center py-8">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={`${item.serviceCategory}-${item.id}`} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={getItemImage(item)} alt="" className="w-8 h-8 object-contain" />
                      <div>
                        <div className="font-medium text-black">{item.name}</div>
                        <div className="text-sm text-gray-600">€{item.price.toFixed(2)} each</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <Link 
                    to="/cart"
                    className="block w-full bg-primary text-white py-3 rounded-full text-center font-medium"