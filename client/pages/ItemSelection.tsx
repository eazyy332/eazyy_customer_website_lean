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
    "eazyy-bag": "eazzy-bag",
    "eazy-bag": "eazyy-bag",
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
      description: "Fix, tailor, and extend your garment’s life. From hemming to zippers—skilled repairs with pickup & delivery.",
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
        .or(`service_identifier.eq.${rawCategory},service_identifier.eq.${category}`)
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
    // Notify any listeners (e.g., floating cart button)
    try {
      window.dispatchEvent(new CustomEvent('cart:updated'));
    } catch {}
  }, [cart]);

  // Guard: only show not found if neither DB service nor a known fallback slug exist
  if (!loading && !service && !allowedSlugs.has(category)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-black mb-4">Service Category Not Found</h1>
          <Link to="/order/start" className="text-primary hover:underline">← Back to Service Categories</Link>
        </div>
      </div>
    );
  }

  // Choose data source
  const usingDb = itemsDb.length > 0;
  const itemsSource: any[] = usingDb ? itemsDb : (currentService?.items ?? []);

  const subcategoryOptions: Array<{ id: string; name: string }> = usingDb
    ? [{ id: 'all', name: 'All' }, ...categoriesDb.map((c: any) => ({ id: String(c.id), name: c.name || 'Category' }))]
    : [{ id: 'all', name: 'All' }, ...(currentService?.subcategories || []).filter((id: string) => id !== 'all').map((id: string) => ({ id, name: id.charAt(0).toUpperCase() + id.slice(1) }))];

  const filteredItems = usingDb
    ? (selectedSubcategory === 'all' ? itemsSource : itemsSource.filter((i: any) => (i.category_id ?? '') === selectedSubcategory))
    : (selectedSubcategory === 'all' ? itemsSource : itemsSource.filter((i: any) => (i.subcategory ?? 'all') === selectedSubcategory));

  const fallbackMeta = serviceMeta[category || ''] || {} as any;
  const meta = {
    title: service?.name ?? fallbackMeta.title ?? '',
    description: service?.short_description ?? service?.description ?? fallbackMeta.description ?? '',
    hero: service?.image_url ?? fallbackMeta.hero ?? "/images_devlopment/eazyy-bag-service-banner-background.png",
    accent: service?.color_hex ?? (service?.color_scheme?.primary) ?? fallbackMeta.accent ?? '#1D62DB',
    label: service?.price_unit ?? fallbackMeta.label ?? 'per piece',
    serviceId: service?.id ?? null,
  } as any;
  const formatEuro = (value: number) => value.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const getItemImage = (item: any) => {
    if (item.icon) return item.icon;
    const key = (item.name || '').toLowerCase();
    if (key.includes('polo')) return poloIcon;
    if (key.includes('henley')) return henleyIcon;
    if (key.includes('t-shirt') || key.includes('tee') || key.includes('shirt')) return tshirtIcon;
    return teeGraphicIcon;
  };

  // Category pill icon mapping per service
  const getSubcategoryIcon = (subcatId: string): string => {
    if (subcatId === 'all') return foldedBagIcon;
    const cat = categoriesDb.find((c) => String(c.id) === subcatId);
    return cat?.icon || cat?.icon_name || foldedBagIcon;
  };

  const addToCart = (item: Item) => {
    const cartItem: CartItem = {
      ...item,
      serviceCategory: category || '',
      quantity: 1
    };

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(cartItem => 
        cartItem.id === item.id && cartItem.serviceCategory === category
      );

      if (existingIndex >= 0) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prevCart, cartItem];
      }
    });
  };

  const addDynamicToCart = (rawItem: any) => {
    const value = Number(dynamicInputs[String(rawItem.id)] || rawItem.min_input_value || 0);
    const unitPrice = Number(rawItem.unit_price || 0);
    if (!value || !unitPrice) return;

    const computedPrice = unitPrice * value;
    const displayItem: Item = {
      id: String(rawItem.id),
      name: String(rawItem.name || ''),
      description: String(rawItem.description || ''),
      price: computedPrice,
      category: category,
      subcategory: String(rawItem.subcategory || rawItem.category_id || ''),
      quantity: 1,
    };

    setCart(prevCart => {
      const idx = prevCart.findIndex(i => i.id === displayItem.id && i.serviceCategory === category);
      if (idx >= 0) {
        const copy = [...prevCart];
        copy[idx] = { ...copy[idx], price: computedPrice, quantity: 1 };
        return copy;
      }
      return [...prevCart, { ...displayItem, serviceCategory: category } as CartItem];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => !(i.id === itemId && i.serviceCategory === category)));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(prevCart => prevCart.filter(item => !(item.id === itemId && item.serviceCategory === category)));
    } else {
      setCart(prevCart => prevCart.map(item => 
        item.id === itemId && item.serviceCategory === category
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getItemQuantityInCart = (itemId: string) => {
    const cartItem = cart.find(item => item.id === itemId && item.serviceCategory === category);
    return cartItem ? cartItem.quantity : 0;
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const proceedToCheckout = () => {
    if (cart.length > 0) {
      navigate('/order/scheduling', {
        state: {
          selectedServices: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            serviceCategory: item.serviceCategory
          })),
          totalPrice: getTotalPrice()
        }
      });
    }
  };

  const continueShopping = () => {
    navigate('/order/start');
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="px-4 md:px-8 lg:px-12 pt-8 pb-12">
        <div className="max-w-[1200px] mx-auto">
          {/* Hero banner */}
          <section className="relative rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(17,24,39,0.15)]">
            <img src={meta.hero} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative z-10 px-6 md:px-10 py-10 md:py-14">
              <div className="inline-flex items-center h-8 px-3 rounded-full text-white/90" style={{ backgroundColor: meta.accent }}>
                <span className="text-[13px] font-medium">6 services</span>
              </div>
              <h1 className="mt-5 text-4xl md:text-5xl font-medium text-white">{meta.title}</h1>
              <p className="mt-3 max-w-2xl text-white/90 text-lg leading-relaxed">{meta.description}</p>

              {/* Right-side circular service selectors */}
              <div className="hidden md:flex items-center gap-5 absolute bottom-6 right-8">
                {[
                  { key: 'eazzy-bag', src: iconBag, alt: 'eazyy bag' },
                  { key: 'dry-cleaning', src: iconDry, alt: 'dry cleaning' },
                  { key: 'wash-iron', src: iconWashIron, alt: 'wash & iron' },
                  { key: 'repairs', src: iconRepair, alt: 'repairs' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => navigate(`/order/items/${item.key}`)}
                    className="w-14 h-14 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow border"
                    style={{ borderColor: `${meta.accent}30` }}
                    aria-label={item.alt}
                  >
                    <img src={item.src} alt="" className="w-8 h-8 object-contain" />
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Subcategory pills */}
          <div className="mt-6 flex gap-3 overflow-x-auto no-scrollbar">
            {subcategoryOptions.map((subcat: any) => (
              <button
                key={subcat.id}
                onClick={() => setSelectedSubcategory(subcat.id)}
                className={`inline-flex items-center gap-2 h-10 px-4 rounded-[10px] border text-sm ${selectedSubcategory === subcat.id ? 'text-white' : 'text-black'} transition-colors`}
                style={{
                  backgroundColor: selectedSubcategory === subcat.id ? meta.accent : '#fff',
                  borderColor: selectedSubcategory === subcat.id ? meta.accent : '#E5E7EB'
                }}
              >
                <img src={getSubcategoryIcon(subcat.id)} alt="" className={`w-5 h-5 object-contain rounded ${selectedSubcategory === subcat.id ? 'bg-white' : 'bg-transparent'}`} />
                {subcat.name}
              </button>
            ))}
          </div>

          {/* Mobile Service Switcher */}
          <div className="mt-4 md:hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Switch Service:</span>
              <span className="text-xs text-gray-500">Swipe to see all</span>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {[
                { key: 'eazzy-bag', src: iconBag, alt: 'eazyy bag', name: 'eazyy Bag' },
                { key: 'dry-cleaning', src: iconDry, alt: 'dry cleaning', name: 'Dry Clean' },
                { key: 'wash-iron', src: iconWashIron, alt: 'wash & iron', name: 'Wash & Iron' },
                { key: 'repairs', src: iconRepair, alt: 'repairs', name: 'Repairs' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => navigate(`/order/items/${item.key}`)}
                  className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl border transition-colors ${
                    category === item.key 
                      ? 'bg-primary/10 border-primary text-primary' 
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <img src={item.src} alt="" className="w-8 h-8 object-contain" />
                  <span className="text-xs font-medium whitespace-nowrap">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Items grid */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10">
            {filteredItems.map((item: any) => {
              const quantityInCart = getItemQuantityInCart(String(item.id));
              const accent = meta.accent;

              // DB-driven attributes for quote/dynamic pricing
              const requiresQuote = Boolean(item?.custom_pricing || item?.is_custom_price);
              const hasDynamic = Boolean(!requiresQuote && item?.unit_price && item?.unit_label);
              const dynamicValue = Number(dynamicInputs[String(item.id)] || 0);
              const dynamicPreview = hasDynamic ? Number(item.unit_price) * (dynamicValue || Number(item.min_input_value || 0)) : 0;

              const price = typeof item.price === 'number' ? item.price : Number(item.price || 0);
              const displayName = String(item.name || '');

              return (
                <div key={String(item.id)} className="group">
                  <img src={getItemImage(item)} alt="" className="w-36 h-36 md:w-40 md:h-40 object-contain mx-auto" />
                  <div className="mt-2 text-[13px] text-black">{displayName}</div>

                  {/* Price row */}
                  {!hasDynamic && (
                    <div className="flex items-baseline gap-1 text-[11px] text-gray-600">
                      <span className="align-super">€</span>
                      <span className="text-[15px] font-semibold text-black">{formatEuro(price)}</span>
                      <span className="ml-1">per piece</span>
                    </div>
                  )}
                  {hasDynamic && (
                    <div className="text-[12px] text-gray-700">
                      €{Number(item.unit_price).toFixed(2)} per {item.unit_label}
                    </div>
                  )}

                  <div className="text-[11px] mt-1" style={{ color: accent }}>{meta.label}</div>

                  {/* Actions */}
                  <div className="mt-2 flex items-center gap-2">
                    {requiresQuote ? (
                      <button
                        onClick={() => navigate('/order/custom-quote', { state: { presetItem: { id: String(item.id), name: displayName, serviceCategory: category } } })}
                        className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:border-primary"
                      >
                        Get Quote
                      </button>
                    ) : hasDynamic ? (
                      <div className="w-full">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={item.min_input_value ?? 0}
                            max={item.max_input_value ?? undefined}
                            step={0.1}
                            value={dynamicValue || ''}
                            onChange={(e) => setDynamicInputs(prev => ({ ...prev, [String(item.id)]: Number(e.target.value) }))}
                            placeholder={item.input_placeholder || `Enter ${item.unit_label}`}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                          <button
                            onClick={() => addDynamicToCart(item)}
                            className="rounded-full bg-primary text-white px-3 py-2 text-sm font-semibold"
                          >
                            Add
                          </button>
                          {quantityInCart > 0 && (
                            <button
                              onClick={() => removeFromCart(String(item.id))}
                              className="rounded-full border border-gray-300 px-3 py-2 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="mt-1 text-xs text-gray-600">
                          {dynamicValue ? `Est. €${dynamicPreview.toFixed(2)}` : (item.min_input_value ? `Min ${item.min_input_value} ${item.unit_label}` : '')}
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => updateQuantity(String(item.id), Math.max(0, quantityInCart - 1))}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-sm disabled:opacity-50"
                          disabled={quantityInCart === 0}
                          aria-label="Decrease"
                        >
                          –
                        </button>
                        <span className="text-sm w-4 text-center">{quantityInCart}</span>
                        <button
                          onClick={() => (quantityInCart === 0 ? addToCart({ id: String(item.id), name: displayName, description: String(item.description || ''), price, category, subcategory: String(item.subcategory || item.category_id || ''), quantity: 1 }) : updateQuantity(String(item.id), quantityInCart + 1))}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-sm"
                          aria-label="Increase"
                        >
                          +
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Sticky order actions */}
      {cart.length > 0 && (
        <div className="fixed inset-x-0 z-50" style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}>
          <div className="mx-auto max-w-[1200px] px-4 md:px-8 lg:px-12">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-xl p-3 flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-600">{cart.reduce((total, item) => total + item.quantity, 0)} items</div>
                <div className="text-lg font-semibold text-black">€{cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/cart')}
                  className="rounded-full border border-gray-300 px-5 py-2.5 font-medium text-sm"
                >
                  View cart
                </button>
                <button
                  onClick={() => {
                    if (cart.length > 0) {
                      navigate('/order/scheduling', {
                        state: {
                          selectedServices: cart.map(item => ({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity,
                            serviceCategory: item.serviceCategory,
                          })),
                          totalPrice: cart.reduce((t, i) => t + (i.price * i.quantity), 0)
                        }
                      });
                    }
                  }}
                  className="rounded-full bg-primary text-white px-5 py-2.5 font-semibold text-sm"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drawer removed; dedicated cart page is used now */}
    </div>
  );
}
