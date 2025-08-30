import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose, DrawerTrigger } from "@/components/ui/drawer";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabase";

function normalizeCategorySlug(raw: string): string {
  const map: Record<string, string> = {
    "easy-bag": "eazyy-bag",
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
  const [allServices, setAllServices] = useState<any[]>([]);

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
      console.log('[ItemSelection] Starting load for category:', { rawCategory, normalized: category });
      
      // Load all services for the selector buttons
      const { data: allServicesData } = await supabase
        .from('services')
        .select('id, name, service_identifier, icon, icon_name')
        .order('sequence', { ascending: true });
      
      console.log('[ItemSelection] All services loaded:', allServicesData);
      
      if (mounted && allServicesData) {
        setAllServices(allServicesData);
      }
      
      // Try both the raw category and normalized category for service lookup
      const { data: svc } = await supabase
        .from('services')
        .select('*')
        .or(`service_identifier.eq.${rawCategory},service_identifier.eq.${category}`)
        .maybeSingle();
      
      console.log('[ItemSelection] Service lookup result:', svc);
      
      if (!mounted) return;
      setService(svc);
      if (svc?.id) {
        console.log('[ItemSelection] Loading categories and items for service:', svc.id);
        
        // Load categories for this service
        const { data: cats, error: catsError } = await supabase
          .from('categories')
          .select('*')
          .eq('service_id', svc.id)
          .order('sequence', { ascending: true });
        
        console.log('[ItemSelection] Categories query result:', { data: cats, error: catsError });
        
        // Load items for this service through categories
        let combinedItems: any[] = [];
        if (cats && cats.length > 0) {
          const categoryIds = cats.map(c => c.id);
          const { data: items, error: itemsError } = await supabase
            .from('items')
            .select('id, name, description, price, category_id, service_id, icon, icon_name, status, sequence, is_custom_price, custom_pricing, unit_price, unit_label, min_input_value, max_input_value, input_placeholder')
            .in('category_id', categoryIds)
            .eq('status', true)
            .order('sequence', { ascending: true });
          
          console.log('[ItemSelection] Items query result:', { 
            data: items, 
            error: itemsError,
            itemsWithIcons: items?.filter(item => item.icon || item.icon_name).length || 0,
            sampleItemIcons: items?.slice(0, 3).map(item => ({
              name: item.name,
              icon: item.icon,
              icon_name: item.icon_name
            })) || []
          });
          combinedItems = items || [];
        } else {
          console.log('[ItemSelection] No categories found, skipping items query');
        }
        
        // Also try loading items directly by service_id if the field exists
        const { data: directItems, error: directItemsError } = await supabase
          .from('items')
          .select('id, name, description, price, category_id, service_id, icon, icon_name, status, sequence, is_custom_price, custom_pricing, unit_price, unit_label, min_input_value, max_input_value, input_placeholder')
          .eq('service_id', svc.id)
          .eq('status', true)
          .order('sequence', { ascending: true });
        
        console.log('[ItemSelection] Direct items query result:', { 
          data: directItems, 
          error: directItemsError,
          itemsWithIcons: directItems?.filter(item => item.icon || item.icon_name).length || 0,
          sampleItemIcons: directItems?.slice(0, 3).map(item => ({
            name: item.name,
            icon: item.icon,
            icon_name: item.icon_name
          })) || []
        });
        
        // Combine items from both queries (remove duplicates by id)
        if (directItems) {
          directItems.forEach(item => {
            if (!combinedItems.find(existing => existing.id === item.id)) {
              combinedItems.push(item);
            }
          });
        }
        
        // Also try loading ALL items to see what's in the database
        const { data: debugAllItems, error: allItemsError } = await supabase
          .from('items')
          .select('id, name, description, price, category_id, service_id, icon, icon_name, status')
          .eq('status', true)
          .limit(10);
        
        console.log('[ItemSelection] ALL items in database (first 10):', { 
          data: debugAllItems, 
          error: allItemsError,
          itemsWithIcons: debugAllItems?.filter(item => item.icon || item.icon_name).length || 0,
          iconSamples: debugAllItems?.map(item => ({
            name: item.name,
            icon: item.icon,
            icon_name: item.icon_name,
            hasIcon: !!(item.icon || item.icon_name),
            iconValue: item.icon,
            iconType: typeof item.icon
          })) || []
        });
        
        // Also try loading ALL categories to see what's in the database
        const { data: allCategories, error: allCategoriesError } = await supabase
          .from('categories')
          .select('*')
          .limit(10);
        
        console.log('[ItemSelection] ALL categories in database (first 10):', { data: allCategories, error: allCategoriesError });
        
        console.log('[ItemSelection] Categories loaded:', cats);
        console.log('[ItemSelection] Items loaded (before filtering):', combinedItems);
        
        if (!mounted) return;
        setCategoriesDb(cats || []);
        setItemsDb(combinedItems);
        console.log('[ItemSelection] Final loaded data:', { 
          service: svc?.name, 
          categories: cats?.length || 0, 
          items: combinedItems?.length || 0,
          itemsWithDescription: combinedItems?.filter(item => item.description && typeof item.description === 'string' && item.description.trim() !== '' && item.description !== 'NULL').length || 0,
          itemsWithStatus: combinedItems?.filter(item => item.status === true).length || 0,
          serviceId: svc.id
        });
      } else {
        console.log('[ItemSelection] No service found for identifier:', { rawCategory, normalized: category });
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

  // Guard: only show not found if no DB service exists
  if (!loading && !service) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-black mb-4">Service Category Not Found</h1>
          <Link to="/order/start" className="text-primary hover:underline">← Back to Service Categories</Link>
        </div>
      </div>
    );
  }

  // Use only database data
  const itemsSource: any[] = itemsDb;

  console.log('[ItemSelection] Items source before filtering:', itemsSource);

  const subcategoryOptions: Array<{ id: string; name: string }> = [
    { id: 'all', name: 'All' }, 
    ...categoriesDb.map((c: any) => ({ id: String(c.id), name: c.name || 'Category' }))
  ];

  const filteredItems = selectedSubcategory === 'all' 
    ? itemsSource 
    : itemsSource.filter((i: any) => (i.category_id ?? '') === selectedSubcategory);

  console.log('[ItemSelection] Items after subcategory filter:', filteredItems);

  // Filter out items without description
  const itemsWithDescription = filteredItems.filter((item: any) => {
    const hasDescription = item.description && 
      typeof item.description === 'string' && 
      item.description.trim() !== '' && 
      item.description !== 'NULL';
    console.log(`[ItemSelection] Item "${item.name}" description check:`, {
      description: item.description,
      hasDescription,
      descriptionType: typeof item.description,
      descriptionLength: item.description?.length || 0
    });
    return hasDescription;
  });

  console.log('[ItemSelection] Items with description:', itemsWithDescription);

  const meta = {
    title: service?.name ?? '',
    description: service?.short_description ?? service?.description ?? '',
    hero: service?.image_url ?? "",
    accent: service?.color_hex ?? '#1D62DB',
    label: service?.price_unit ?? 'per piece',
    serviceId: service?.id ?? null,
  } as any;

  const formatEuro = (value: number) => value.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  const getItemImage = (item: any) => {
    // Debug what's in the icon field
    console.log(`[DEBUG] Item "${item.name}" icon field:`, {
      icon: item.icon,
      iconType: typeof item.icon,
      iconValue: JSON.stringify(item.icon),
      isValidUrl: item.icon && (item.icon.startsWith('http://') || item.icon.startsWith('https://'))
    });
    
    // Return the icon directly from database
    return item.icon || "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop";
  };

  // Category pill icon mapping per service
  const getSubcategoryIcon = (subcatId: string): string => {
    if (subcatId === 'all') return service?.icon || service?.image_url || "";
    const cat = categoriesDb.find((c) => String(c.id) === subcatId);
    return cat?.icon || cat?.icon_name || "";
  };

  const getServiceIcon = (serviceIdentifier: string) => {
    const serviceData = allServices.find(s => 
      s.service_identifier === serviceIdentifier
    );
    return serviceData?.icon || serviceData?.image_url || "";
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
            {meta.hero ? (
              <img src={meta.hero} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 to-blue-700"></div>
            )}
            <div className="relative z-10 px-6 md:px-10 py-10 md:py-14">
              <div className="inline-flex items-center h-8 px-3 rounded-full text-white/90" style={{ backgroundColor: meta.accent }}>
                <span className="text-[13px] font-medium">{allServices.length} services</span>
              </div>
              <h1 className="mt-5 text-4xl md:text-5xl font-medium text-white">{meta.title}</h1>
              <p className="mt-3 max-w-2xl text-white/90 text-lg leading-relaxed">{meta.description}</p>

              {/* Right-side circular service selectors - visible on all screen sizes */}
              <div className="flex items-center gap-3 md:gap-5 absolute bottom-6 right-4 md:right-8">
                {allServices.map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => navigate(`/order/items/${svc.service_identifier}`)}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow border border-gray-200 hover:border-primary transition-colors"
                    aria-label={svc.name}
                  >
                    {(svc.icon || svc.image_url) ? (
                      <img 
                        src={svc.icon || svc.image_url} 
                        alt={svc.name} 
                        className="w-6 h-6 md:w-8 md:h-8 object-contain rounded"
                      />
                    ) : (
                      <span className="text-lg">📦</span>
                    )}
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
                {getSubcategoryIcon(subcat.id) ? (
                  <img src={getSubcategoryIcon(subcat.id)} alt="" className={`w-5 h-5 object-contain rounded ${selectedSubcategory === subcat.id ? 'bg-white' : 'bg-transparent'}`} />
                ) : (
                  <span className="text-lg">📦</span>
                )}
                {subcat.name}
              </button>
            ))}
          </div>

          {/* Items grid */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10">
            {itemsWithDescription.map((item: any) => {
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
                  <div className="w-36 h-36 md:w-40 md:h-40 mb-2">
                    <img 
                      src={item.icon}
                      onLoad={() => console.log(`[IMAGE] Successfully loaded: ${item.icon}`)}
                      onError={(e) => {
                        console.log(`[IMAGE] Failed to load: ${item.icon}`);
                        console.log('[IMAGE] Error details:', e);
                        // Set fallback image on error
                        e.currentTarget.src = "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop";
                      }}
                      alt={item.name}
                      className="w-36 h-36 md:w-40 md:h-40 object-cover rounded-lg"
                    />
                  </div>
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
                        <div className="space-y-3">
                          <div className="px-2">
                            <input
                              type="range"
                              min={item.min_input_value ?? 0}
                              max={item.max_input_value ?? 100}
                              step={0.1}
                              value={dynamicValue || item.min_input_value || 0}
                              onChange={(e) => setDynamicInputs(prev => ({ ...prev, [String(item.id)]: Number(e.target.value) }))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                              style={{
                                background: `linear-gradient(to right, #1D62DB 0%, #1D62DB ${((dynamicValue || item.min_input_value || 0) - (item.min_input_value || 0)) / ((item.max_input_value || 100) - (item.min_input_value || 0)) * 100}%, #e5e7eb ${((dynamicValue || item.min_input_value || 0) - (item.min_input_value || 0)) / ((item.max_input_value || 100) - (item.min_input_value || 0)) * 100}%, #e5e7eb 100%)`
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>{item.min_input_value || 0} {item.unit_label}</span>
                            <span className="font-medium text-black">
                              {dynamicValue || item.min_input_value || 0} {item.unit_label}
                            </span>
                            <span>{item.max_input_value || 100} {item.unit_label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => addDynamicToCart(item)}
                              disabled={!dynamicValue && !item.min_input_value}
                              className="flex-1 rounded-full bg-primary text-white px-3 py-2 text-sm font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
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
    </div>
  );
}