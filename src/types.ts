export type FoodCategory = 'all' | 'rice' | 'swallow' | 'proteins' | 'sides' | 'drinks';

export interface SwallowOption {
  id: string;
  name: string;
  price: number;
}

export interface ProteinOption {
  id: string;
  name: string;
  price: number;
}

export interface SideOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  nativeSubtitle?: string;
  description: string;
  price: number;
  category: 'rice' | 'swallow' | 'proteins' | 'sides' | 'drinks';
  image: string;
  inStock: boolean;
  popular?: boolean;
  spicyLevel?: 0 | 1 | 2 | 3; // 0 none, 1 mild, 2 hot, 3 extra spicy
  prepTimeMinutes?: number;
  allowsSwallowChoice?: boolean;
  allowsProteinChoice?: boolean;
  allowsExtraSides?: boolean;
}

export interface CartItem {
  cartLineId: string;
  menuItemId: string;
  name: string;
  basePrice: number;
  image: string;
  selectedSwallow?: SwallowOption;
  selectedProtein?: ProteinOption;
  selectedSides?: SideOption[];
  specialInstructions?: string;
  quantity: number;
  unitPrice: number;
  itemTotal: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  state: string;
  fee: number;
  estimatedMinutes: string;
}

export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address?: string;
  zoneId?: string;
}

export type OrderStatus = 'payment_confirmed' | 'in_kitchen' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface StatusUpdate {
  status: OrderStatus;
  timestamp: string;
  label: string;
  description: string;
}

export interface RiderInfo {
  name: string;
  phone: string;
  bikeNumber: string;
  whatsappUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  deliveryType: 'delivery' | 'pickup';
  deliveryZone?: DeliveryZone;
  deliveryAddress?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  specialInstructions?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  packagingFee: number;
  total: number;
  paymentMethod: 'card' | 'bank_transfer' | 'ussd';
  paymentReference: string;
  status: OrderStatus;
  statusHistory: StatusUpdate[];
  riderInfo?: RiderInfo;
  estimatedArrivalMinutes: number;
}

export interface StoreSettings {
  isOpen: boolean;
  openingTime: string; // e.g. "08:00"
  closingTime: string; // e.g. "21:00"
  manualPause: boolean;
  pauseReason?: string;
  announcement?: string;
  packagingFee: number;
  acceptingOrders: boolean;
}
