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
    localStorage.setItem('eaz