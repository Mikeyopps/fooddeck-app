import { MenuItem, SwallowOption, ProteinOption, SideOption, DeliveryZone, Order, StoreSettings } from '../types';

export const SWALLOW_OPTIONS: SwallowOption[] = [
  { id: 'sw-1', name: 'Pounded Yam (Iyan)', price: 900 },
  { id: 'sw-2', name: 'Amala Dudu (Isu)', price: 800 },
  { id: 'sw-3', name: 'Yellow Garri (Eba)', price: 600 },
  { id: 'sw-4', name: 'Semovita', price: 700 },
  { id: 'sw-5', name: 'Wheat Meal', price: 700 },
];

export const PROTEIN_OPTIONS: ProteinOption[] = [
  { id: 'pr-1', name: 'Succulent Goat Meat (Ogufe)', price: 1500 },
  { id: 'pr-2', name: 'Assorted Meat (Shaki, Abodi, Beef)', price: 1300 },
  { id: 'pr-3', name: 'Fried Croaker Fish in Pepper Stew', price: 1800 },
  { id: 'pr-4', name: 'Crispy Fried Chicken Leg', price: 1200 },
  { id: 'pr-5', name: 'Peppered Turkey Cutlet', price: 1700 },
  { id: 'pr-6', name: 'Smoked Stockfish & Ponmo Combo', price: 1400 },
];

export const SIDE_OPTIONS: SideOption[] = [
  { id: 'sd-1', name: 'Golden Fried Plantain (Dodo)', price: 800 },
  { id: 'sd-2', name: 'Steamed Moi-Moi Elewe (Leaf Wrapped)', price: 900 },
  { id: 'sd-3', name: 'Crispy Fried Egg', price: 400 },
  { id: 'sd-4', name: 'Extra Chef Special Pepper Sauce', price: 400 },
  { id: 'sd-5', name: 'Fresh Crunchy Coleslaw', price: 600 },
];

export const DELIVERY_ZONES: DeliveryZone[] = [
  { id: 'dz-1', name: 'Victoria Island (VI)', state: 'Lagos', fee: 1500, estimatedMinutes: '30-40 mins' },
  { id: 'dz-2', name: 'Lekki Phase 1', state: 'Lagos', fee: 1200, estimatedMinutes: '25-35 mins' },
  { id: 'dz-3', name: 'Ikoyi & Banana Island', state: 'Lagos', fee: 1800, estimatedMinutes: '35-45 mins' },
  { id: 'dz-4', name: 'Ikeja GRA & Allen Avenue', state: 'Lagos', fee: 1500, estimatedMinutes: '30-40 mins' },
  { id: 'dz-5', name: 'Yaba & Sabo Tech Hub', state: 'Lagos', fee: 1000, estimatedMinutes: '20-30 mins' },
  { id: 'dz-6', name: 'Surulere & Ojuelegba', state: 'Lagos', fee: 1200, estimatedMinutes: '25-35 mins' },
  { id: 'dz-7', name: 'Maryland & Anthony Village', state: 'Lagos', fee: 1400, estimatedMinutes: '30-40 mins' },
  { id: 'dz-8', name: 'Gbagada Phase 1 & 2', state: 'Lagos', fee: 1300, estimatedMinutes: '25-35 mins' },
  { id: 'dz-9', name: 'Magodo GRA Phase 2', state: 'Lagos', fee: 1800, estimatedMinutes: '40-50 mins' },
  { id: 'dz-10', name: 'Ajah & Sangotedo', state: 'Lagos', fee: 2200, estimatedMinutes: '50-65 mins' },
];

export const MENU_ITEMS: MenuItem[] = [
  // Rice & Grains
  {
    id: 'm-1',
    name: 'Party Smoky Jollof Rice Special',
    nativeSubtitle: 'Rich firewood aroma with fried plantain',
    description: 'Authentic firewood-infused Nigerian party jollof rice cooked in rich plum tomato, tatashe pepper broth with sweet corn, peas, and golden fried dodo.',
    price: 3200,
    category: 'rice',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    popular: true,
    spicyLevel: 2,
    prepTimeMinutes: 20,
    allowsProteinChoice: true,
    allowsExtraSides: true,
  },
  {
    id: 'm-2',
    name: 'Native Village Fried Rice',
    nativeSubtitle: 'Loaded with dried prawns, liver & shredded beef',
    description: 'Flavor-packed rice tossed in local crayfish, green peppers, sweet corn, diced cow liver, and seasoned with local herbs and rich stock.',
    price: 3500,
    category: 'rice',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    popular: true,
    spicyLevel: 1,
    prepTimeMinutes: 25,
    allowsProteinChoice: true,
    allowsExtraSides: true,
  },
  {
    id: 'm-3',
    name: 'Special Ofada Rice with Ayamase Sauce',
    nativeSubtitle: 'Unpolished short grain rice & bleached palm oil stew',
    description: 'Traditional fermented unpolished Ofada rice wrapped in banana leaf, served with fiery designer stew (Ayamase) packed with diced shaki, beef, and boiled egg.',
    price: 4200,
    category: 'rice',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    popular: true,
    spicyLevel: 3,
    prepTimeMinutes: 25,
    allowsExtraSides: true,
  },

  // Swallow & Soups
  {
    id: 'm-4',
    name: 'Chef Egusi Elegusi Soup',
    nativeSubtitle: 'Ground melon seed stew with uziza & pumpkin leaves',
    description: 'Rich, thick melon seed soup simmered in crayfish broth, smoked catfish, soft ponmo, and fresh bitterleaf/ugu greens. Served with your choice of piping hot swallow.',
    price: 3800,
    category: 'swallow',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    popular: true,
    spicyLevel: 2,
    prepTimeMinutes: 20,
    allowsSwallowChoice: true,
    allowsProteinChoice: true,
    allowsExtraSides: true,
  },
  {
    id: 'm-5',
    name: 'Authentic Abula Special (Amala, Gbegiri & Ewedu)',
    nativeSubtitle: 'Classic Oyo style trinity with spicy buka stew',
    description: 'Piping hot velvet Amala Isu paired with silky yellow Gbegiri (bean soup), fresh green Ewedu, and deep savory peppered buka stew with assorted meats.',
    price: 3900,
    category: 'swallow',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    popular: true,
    spicyLevel: 2,
    prepTimeMinutes: 18,
    allowsSwallowChoice: true,
    allowsProteinChoice: true,
    allowsExtraSides: true,
  },
  {
    id: 'm-6',
    name: 'Rich Efo Riro Elegusi Bowl',
    nativeSubtitle: 'Lagos style spinach vegetable stew with locust beans',
    description: 'Steamed fresh Shoko and Tete greens simmered in iru (locust beans), ground crayfish, and pepper sauce, garnished with soft cow skin and dry fish.',
    price: 3600,
    category: 'swallow',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    popular: false,
    spicyLevel: 2,
    prepTimeMinutes: 20,
    allowsSwallowChoice: true,
    allowsProteinChoice: true,
    allowsExtraSides: true,
  },
  {
    id: 'm-7',
    name: 'Fisherman Seafood Okro Soup',
    nativeSubtitle: 'Lump crab, giant prawns, fresh calamari & croaker',
    description: 'Crunchy diced fresh okra simmered in aromatic fish stock with jumbo prawns, periwinkles, stockfish, and fresh scotch bonnet peppers.',
    price: 5200,
    category: 'swallow',
    image: 'https://images.unsplash.com/photo-1514944298352-78d1a1b181db?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    popular: true,
    spicyLevel: 2,
    prepTimeMinutes: 30,
    allowsSwallowChoice: true,
    allowsExtraSides: true,
  },

  // Proteins & Grills
  {
    id: 'm-8',
    name: 'Spicy Peppered Goat Meat (Asun Platter)',
    nativeSubtitle: 'Fire-grilled tender goat meat sautéed in hot habanero',
    description: 'Charcoal-grilled tender diced goat meat tossed in roasted red onions, sweet tatashe peppers, and pungent scotch bonnets. A true Lagos party classic.',
    price: 3500,
    category: 'proteins',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    popular: true,
    spicyLevel: 3,
    prepTimeMinutes: 15,
    allowsExtraSides: true,
  },
  {
    id: 'm-9',
    name: 'Lagos Beef Suya Special Skewers',
    nativeSubtitle: 'Thinly sliced tender beef rubbed with fiery Yaji spice',
    description: 'Wood-fired beef skewers generously coated in northern kuli-kuli peanut spice mix, served with fresh red onions, tomatoes, and cabbage salad.',
    price: 2800,
    category: 'proteins',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    popular: true,
    spicyLevel: 3,
    prepTimeMinutes: 15,
    allowsExtraSides: true,
  },
  {
    id: 'm-10',
    name: 'Grilled Whole Peppered Croaker Fish',
    nativeSubtitle: 'Marinated in spicy scotch bonnet marinade',
    description: 'Fresh jumbo croaker fish deeply scored and grilled to perfection, basted in rich bell pepper and garlic relish, served with lime wedges and sweet plantain.',
    price: 4800,
    category: 'proteins',
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    popular: false,
    spicyLevel: 2,
    prepTimeMinutes: 25,
    allowsExtraSides: true,
  },
  {
    id: 'm-11',
    name: 'Crispy Quarter Fried Chicken',
    nativeSubtitle: 'Seasoned with thyme, curry & Nigerian seasoning',
    description: 'Crisp, golden-brown chicken quarter marinated overnight in aromatic Nigerian herbs, ginger, garlic, and fried to juicy tenderness.',
    price: 2400,
    category: 'proteins',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
    inStock: false,
    popular: false,
    spicyLevel: 1,
    prepTimeMinutes: 15,
    allowsExtraSides: true,
  },

  // Sides & Extras
  {
    id: 'm-12',
    name: 'Golden Fried Dodo (Ripe Plantain)',
    nativeSubtitle: 'Sweet, caramelized ripe plantain slices',
    description: 'Perfect slices of ripe sweet plantain fried to a glistening golden brown with a crispy edge and tender honeyed center.',
    price: 1200,
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    popular: true,
    spicyLevel: 0,
    prepTimeMinutes: 10,
  },
  {
    id: 'm-13',
    name: 'Special Moi-Moi Elewe (Pouch Steamed)',
    nativeSubtitle: 'Steamed black-eyed bean pudding with flaked fish & egg',
    description: 'Velvety smooth pureed brown bean pudding blended with crayfish, bell peppers, and palm oil, folded into fresh fragrant leaves for supreme aroma.',
    price: 1500,
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    popular: true,
    spicyLevel: 1,
    prepTimeMinutes: 10,
  },
  {
    id: 'm-14',
    name: 'Traditional Nigerian Meat Pie (2 Pcs)',
    nativeSubtitle: 'Flaky buttery shortcrust pastry with minced beef filling',
    description: 'Golden, buttery baked pastry stuffed with savory minced beef, potatoes, carrots, and sweet onions baked fresh throughout the morning.',
    price: 1800,
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    popular: false,
    spicyLevel: 1,
    prepTimeMinutes: 5,
  },

  // Drinks & Beverages
  {
    id: 'm-15',
    name: 'Fresh Chilled Chapman Mocktail (500ml)',
    nativeSubtitle: 'Signature Nigerian club mocktail with cucumber & bitters',
    description: 'The definitive Nigerian party refresher blending Fanta, Sprite, aromatic Grenadine, Angostura bitters, fresh cucumber ribbons, and orange slices.',
    price: 1800,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    popular: true,
    spicyLevel: 0,
    prepTimeMinutes: 5,
  },
  {
    id: 'm-16',
    name: 'Artisanal Zobo Infusion (500ml)',
    nativeSubtitle: 'Hibiscus tea steeped with ginger, pineapple & cloves',
    description: 'Chilled deep-crimson hibiscus calyces brewed with real crushed pineapples, spicy ginger root, and natural honey sweetening. 100% organic.',
    price: 1400,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    popular: true,
    spicyLevel: 0,
    prepTimeMinutes: 5,
  },
  {
    id: 'm-17',
    name: 'Ice-Cold Maltina Can (330ml)',
    nativeSubtitle: 'Rich malt beverage with vitamins & calcium',
    description: 'Served frost-cold straight from our blast chillers for the ultimate rich malty thirst quencher.',
    price: 800,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    popular: false,
    spicyLevel: 0,
    prepTimeMinutes: 2,
  },
  {
    id: 'm-18',
    name: 'Chilled Bottled Spring Water (75cl)',
    nativeSubtitle: 'Pure bottled natural spring water',
    description: 'Crisp and refreshing premium bottled spring water chilled to perfection.',
    price: 400,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    popular: false,
    spicyLevel: 0,
    prepTimeMinutes: 2,
  }
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  isOpen: true,
  openingTime: '08:00',
  closingTime: '21:30',
  manualPause: false,
  pauseReason: 'Kitchen taking a 15-minute breather due to high in-store volume',
  announcement: '🇳🇬 Authentic Lagos flavors delivered hot & fast. Upfront pre-payment guarantees prompt preparation!',
  packagingFee: 400,
  acceptingOrders: true,
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-8941',
    orderNumber: '#FD-8941',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    deliveryType: 'delivery',
    deliveryZone: DELIVERY_ZONES[1], // Lekki Phase 1
    deliveryAddress: 'Block 4, Flat 2, Admiralty Way, Lekki Phase 1, Lagos',
    customerName: 'Tunde Adeleke',
    customerPhone: '+234 803 456 7890',
    customerEmail: 'tunde.adeleke@gmail.com',
    specialInstructions: 'Please ensure the plantain is well-fried and pepper sauce on the side.',
    items: [
      {
        cartLineId: 'cl-1',
        menuItemId: 'm-1',
        name: 'Party Smoky Jollof Rice Special',
        basePrice: 3200,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        selectedProtein: PROTEIN_OPTIONS[0], // Succulent Goat Meat
        selectedSides: [SIDE_OPTIONS[0]], // Fried Plantain
        specialInstructions: 'Well peppered please',
        quantity: 2,
        unitPrice: 3200 + 1500 + 800, // 5500
        itemTotal: 11000,
      },
      {
        cartLineId: 'cl-2',
        menuItemId: 'm-15',
        name: 'Fresh Chilled Chapman Mocktail (500ml)',
        basePrice: 1800,
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
        quantity: 2,
        unitPrice: 1800,
        itemTotal: 3600,
      }
    ],
    subtotal: 14600,
    deliveryFee: 1200,
    packagingFee: 400,
    total: 16200,
    paymentMethod: 'card',
    paymentReference: 'PAY_FD_99238411',
    status: 'in_kitchen',
    statusHistory: [
      {
        status: 'payment_confirmed',
        timestamp: new Date(Date.now() - 12 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        label: 'Payment Verified',
        description: 'Payment of ₦16,200 verified via Paystack card gateway.'
      },
      {
        status: 'in_kitchen',
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        label: 'In the Kitchen',
        description: 'Chef Chioma and team have begun steaming your goat meat and plating jollof.'
      }
    ],
    riderInfo: {
      name: 'Ibrahim Sani',
      phone: '+234 812 345 6789',
      bikeNumber: 'LAG-349-XG (Red Boxer 150)',
      whatsappUrl: 'https://wa.me/2348123456789?text=Hello%20Ibrahim,%20regarding%20my%20FoodDeck%20order%20%23FD-8941'
    },
    estimatedArrivalMinutes: 24,
  },
  {
    id: 'ord-8939',
    orderNumber: '#FD-8939',
    createdAt: new Date(Date.now() - 38 * 60 * 1000).toISOString(),
    deliveryType: 'delivery',
    deliveryZone: DELIVERY_ZONES[0], // Victoria Island
    deliveryAddress: 'Plot 12, Adeola Odeku Street, Victoria Island, Lagos',
    customerName: 'Ngozi Okonjo',
    customerPhone: '+234 802 987 6543',
    customerEmail: 'ngozi.okonjo@fintech.ng',
    specialInstructions: 'Ring doorbell or call when at the security gate.',
    items: [
      {
        cartLineId: 'cl-3',
        menuItemId: 'm-4',
        name: 'Chef Egusi Elegusi Soup',
        basePrice: 3800,
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
        selectedSwallow: SWALLOW_OPTIONS[0], // Pounded Yam
        selectedProtein: PROTEIN_OPTIONS[1], // Assorted Meat
        quantity: 1,
        unitPrice: 3800 + 900 + 1300, // 6000
        itemTotal: 6000,
      },
      {
        cartLineId: 'cl-4',
        menuItemId: 'm-16',
        name: 'Artisanal Zobo Infusion (500ml)',
        basePrice: 1400,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
        quantity: 1,
        unitPrice: 1400,
        itemTotal: 1400,
      }
    ],
    subtotal: 7400,
    deliveryFee: 1500,
    packagingFee: 400,
    total: 9300,
    paymentMethod: 'bank_transfer',
    paymentReference: 'TRF_FD_77182904',
    status: 'out_for_delivery',
    statusHistory: [
      {
        status: 'payment_confirmed',
        timestamp: new Date(Date.now() - 38 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        label: 'Payment Verified',
        description: 'Instant bank transfer of ₦9,300 received via Wema virtual account.'
      },
      {
        status: 'in_kitchen',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        label: 'In the Kitchen',
        description: 'Meal prepared and packed securely in thermal food packs.'
      },
      {
        status: 'out_for_delivery',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        label: 'Out for Delivery',
        description: 'Rider Chinedu has picked up your package and is navigating to your address.'
      }
    ],
    riderInfo: {
      name: 'Chinedu Eze',
      phone: '+234 809 876 5432',
      bikeNumber: 'EKY-882-AB (Blue TVS Star)',
      whatsappUrl: 'https://wa.me/2348098765432?text=Hello%20Chinedu,%20regarding%20my%20FoodDeck%20order%20%23FD-8939'
    },
    estimatedArrivalMinutes: 8,
  },
  {
    id: 'ord-8920',
    orderNumber: '#FD-8920',
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    deliveryType: 'pickup',
    customerName: 'Babajide Cole',
    customerPhone: '+234 818 123 4567',
    customerEmail: 'babs.cole@gmail.com',
    items: [
      {
        cartLineId: 'cl-5',
        menuItemId: 'm-5',
        name: 'Authentic Abula Special (Amala, Gbegiri & Ewedu)',
        basePrice: 3900,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
        selectedSwallow: SWALLOW_OPTIONS[1], // Amala Dudu
        selectedProtein: PROTEIN_OPTIONS[0], // Goat Meat
        quantity: 1,
        unitPrice: 3900 + 800 + 1500,
        itemTotal: 6200,
      }
    ],
    subtotal: 6200,
    deliveryFee: 0,
    packagingFee: 400,
    total: 6600,
    paymentMethod: 'ussd',
    paymentReference: 'USSD_FD_339182',
    status: 'delivered',
    statusHistory: [
      {
        status: 'payment_confirmed',
        timestamp: '11:15 AM',
        label: 'Payment Verified',
        description: 'USSD payment confirmed.'
      },
      {
        status: 'in_kitchen',
        timestamp: '11:22 AM',
        label: 'In the Kitchen',
        description: 'Kitchen prepared order for takeout counter.'
      },
      {
        status: 'delivered',
        timestamp: '11:50 AM',
        label: 'Picked Up & Completed',
        description: 'Order handed over to customer at pickup desk.'
      }
    ],
    estimatedArrivalMinutes: 0,
  }
];
